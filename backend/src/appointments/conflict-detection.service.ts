import { Injectable, BadRequestException } from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';
import { TravelService } from './travel/travel.service';

export interface AppointmentConflict {
  type: 'OVERLAP' | 'TRAVEL_OVERLAP' | 'BUFFER_VIOLATION' | 'AVAILABILITY_VIOLATION' | 'AFFILIATION_VIOLATION';
  message: string;
  details?: any;
}

@Injectable()
export class ConflictDetectionService {
  constructor(
    private readonly repo: AppointmentsRepository,
    private readonly travelService: TravelService,
  ) {}

  async checkConflicts(
    doctorId: string,
    hospitalId: string,
    scheduledStart: Date,
    scheduledEnd: Date,
    excludeAppointmentId?: string,
  ): Promise<AppointmentConflict[]> {
    const conflicts: AppointmentConflict[] = [];

    // 1. Hospital affiliation validation
    const affiliation = await this.repo.findAffiliation(doctorId, hospitalId);
    if (!affiliation) {
      conflicts.push({
        type: 'AFFILIATION_VIOLATION',
        message: `Doctor does not have an active affiliation with hospital ${hospitalId}.`,
      });
    }

    // 2. Availability window violation
    if (affiliation) {
      const dayOfWeek = scheduledStart.getDay();
      const windows = await this.repo.findAvailabilityWindows(affiliation.id, dayOfWeek);

      const startHours = scheduledStart.getHours().toString().padStart(2, '0');
      const startMinutes = scheduledStart.getMinutes().toString().padStart(2, '0');
      const startHHMM = `${startHours}:${startMinutes}`;

      const endHours = scheduledEnd.getHours().toString().padStart(2, '0');
      const endMinutes = scheduledEnd.getMinutes().toString().padStart(2, '0');
      const endHHMM = `${endHours}:${endMinutes}`;

      const inWindow = windows.some((win) => {
        return startHHMM >= win.startTime && endHHMM <= win.endTime;
      });

      if (!inWindow) {
        conflicts.push({
          type: 'AVAILABILITY_VIOLATION',
          message: `Proposed slot (${startHHMM} - ${endHHMM}) does not fall entirely within the doctor's active availability windows on dayOfWeek ${dayOfWeek} at this hospital.`,
        });
      }
    }

    // Get doctor default buffer
    const doctor = await this.repo.findDoctorById(doctorId);
    const buffer = doctor?.defaultBuffer ?? 0;

    // 3. Fetch surrounding appointments on the same day (+/- 24 hours to capture adjacent calendar days)
    const startRange = new Date(scheduledStart.getTime() - 24 * 60 * 60 * 1000);
    const endRange = new Date(scheduledEnd.getTime() + 24 * 60 * 60 * 1000);

    const existingAppointments = await this.repo.findDoctorAppointmentsForDay(
      doctorId,
      startRange,
      endRange,
      excludeAppointmentId,
    );

    // 4. Overlap, Travel, and Buffer checks
    for (const appt of existingAppointments) {
      // a) Time overlap check
      const overlaps = scheduledStart < appt.scheduledEnd && scheduledEnd > appt.scheduledStart;
      if (overlaps) {
        conflicts.push({
          type: 'OVERLAP',
          message: `Proposed slot overlaps with existing appointment ${appt.id} (${appt.scheduledStart.toISOString()} - ${appt.scheduledEnd.toISOString()}).`,
          details: { appointmentId: appt.id },
        });
      }
    }

    // Build timeline to check travel/buffer between consecutive appointments
    const timeline = existingAppointments.map((e) => ({
      id: e.id,
      start: e.scheduledStart,
      end: e.scheduledEnd,
      hospitalId: e.hospitalId,
      isProposed: false,
    }));

    timeline.push({
      id: 'proposed',
      start: scheduledStart,
      end: scheduledEnd,
      hospitalId,
      isProposed: true,
    });

    timeline.sort((a, b) => a.start.getTime() - b.start.getTime());

    const proposedIndex = timeline.findIndex((item) => item.isProposed);

    if (proposedIndex !== -1) {
      // Check predecessor
      if (proposedIndex > 0) {
        const pred = timeline[proposedIndex - 1];
        const travelTime = await this.travelService.getTravelTimeBetweenHospitals(
          pred.hospitalId,
          hospitalId,
        );
        const gap = (scheduledStart.getTime() - pred.end.getTime()) / 60000; // in minutes

        if (pred.hospitalId !== hospitalId && gap < travelTime) {
          conflicts.push({
            type: 'TRAVEL_OVERLAP',
            message: `Travel overlap with previous appointment ending at ${pred.end.toISOString()} (gap: ${gap} mins, travel time: ${travelTime} mins).`,
          });
        }

        const requiredGap = travelTime + buffer;
        if (gap < requiredGap) {
          conflicts.push({
            type: 'BUFFER_VIOLATION',
            message: `Buffer violation with previous appointment ending at ${pred.end.toISOString()} (gap: ${gap} mins, required gap: ${requiredGap} mins).`,
          });
        }
      }

      // Check successor
      if (proposedIndex < timeline.length - 1) {
        const succ = timeline[proposedIndex + 1];
        const travelTime = await this.travelService.getTravelTimeBetweenHospitals(
          hospitalId,
          succ.hospitalId,
        );
        const gap = (succ.start.getTime() - scheduledEnd.getTime()) / 60000; // in minutes

        if (succ.hospitalId !== hospitalId && gap < travelTime) {
          conflicts.push({
            type: 'TRAVEL_OVERLAP',
            message: `Travel overlap with next appointment starting at ${succ.start.toISOString()} (gap: ${gap} mins, travel time: ${travelTime} mins).`,
          });
        }

        const requiredGap = travelTime + buffer;
        if (gap < requiredGap) {
          conflicts.push({
            type: 'BUFFER_VIOLATION',
            message: `Buffer violation with next appointment starting at ${succ.start.toISOString()} (gap: ${gap} mins, required gap: ${requiredGap} mins).`,
          });
        }
      }
    }

    return conflicts;
  }
}
