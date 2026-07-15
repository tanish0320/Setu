import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';
import { TravelService } from './travel/travel.service';
import { GetSuggestionsDto } from './dto/get-suggestions.dto';

export interface SuggestedSlot {
  time: string;
  travel: number;
  confidence: 'Green' | 'Amber' | 'Red';
  reason: string;
}

@Injectable()
export class SlotSuggestionService {
  constructor(
    private readonly repo: AppointmentsRepository,
    private readonly travelService: TravelService,
  ) {}

  async getSuggestions(query: GetSuggestionsDto): Promise<SuggestedSlot[]> {
    const { doctorId, hospitalId, duration, targetDate } = query;

    // 1. Fetch affiliation
    const affiliation = await this.repo.findAffiliation(doctorId, hospitalId);
    if (!affiliation) {
      throw new NotFoundException(`Doctor with ID ${doctorId} does not have an active affiliation with hospital ${hospitalId}.`);
    }

    // 2. Parse targetDate to local day boundaries
    const [year, month, day] = targetDate.split('-').map(Number);
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
    const dayOfWeek = startOfDay.getDay();

    // 3. Find availability windows
    const windows = await this.repo.findAvailabilityWindows(affiliation.id, dayOfWeek);
    if (windows.length === 0) {
      return [];
    }

    // 4. Find all active doctor appointments for the target day (+/- 24h)
    const startRange = new Date(startOfDay.getTime() - 24 * 60 * 60 * 1000);
    const endRange = new Date(endOfDay.getTime() + 24 * 60 * 60 * 1000);
    const existingAppointments = await this.repo.findDoctorAppointmentsForDay(doctorId, startRange, endRange);

    // 5. Fetch doctor buffer
    const doctor = await this.repo.findDoctorById(doctorId);
    const defaultBuffer = doctor?.defaultBuffer ?? 0;

    const candidates: SuggestedSlot[] = [];

    // 6. Scan windows
    for (const win of windows) {
      const [sh, sm] = win.startTime.split(':').map(Number);
      const [eh, em] = win.endTime.split(':').map(Number);

      const windowStart = new Date(year, month - 1, day, sh, sm, 0, 0);
      const windowEnd = new Date(year, month - 1, day, eh, em, 0, 0);

      // Scan candidate slots by stepping 15 minutes
      let current = new Date(windowStart);
      while (current.getTime() + duration * 60 * 1000 <= windowEnd.getTime()) {
        const slotStart = new Date(current);
        const slotEnd = new Date(current.getTime() + duration * 60 * 1000);

        // a) Overlap check with any existing appointments
        let overlaps = false;
        for (const appt of existingAppointments) {
          if (slotStart < appt.scheduledEnd && slotEnd > appt.scheduledStart) {
            overlaps = true;
            break;
          }
        }

        if (overlaps) {
          current = new Date(current.getTime() + 15 * 60 * 1000);
          continue;
        }

        // b) Find predecessor appointment (ends closest to slotStart)
        let predAppt = null;
        for (const appt of existingAppointments) {
          if (appt.scheduledEnd <= slotStart) {
            if (!predAppt || appt.scheduledEnd > predAppt.scheduledEnd) {
              predAppt = appt;
            }
          }
        }

        // c) Find successor appointment (starts closest to slotEnd)
        let succAppt = null;
        for (const appt of existingAppointments) {
          if (appt.scheduledStart >= slotEnd) {
            if (!succAppt || appt.scheduledStart < succAppt.scheduledStart) {
              succAppt = appt;
            }
          }
        }

        // d) Validate travel & buffers
        let isValid = true;
        let gapBefore = Infinity;
        let travelBefore = 0;

        if (predAppt) {
          travelBefore = await this.travelService.getTravelTimeBetweenHospitals(predAppt.hospitalId, hospitalId);
          const actGapBefore = (slotStart.getTime() - predAppt.scheduledEnd.getTime()) / 60000;
          const reqGapBefore = travelBefore + defaultBuffer;

          if (actGapBefore < reqGapBefore) {
            isValid = false;
          } else {
            gapBefore = actGapBefore - reqGapBefore;
          }
        }

        let gapAfter = Infinity;
        let travelAfter = 0;

        if (succAppt && isValid) {
          travelAfter = await this.travelService.getTravelTimeBetweenHospitals(hospitalId, succAppt.hospitalId);
          const actGapAfter = (succAppt.scheduledStart.getTime() - slotEnd.getTime()) / 60000;
          const reqGapAfter = travelAfter + defaultBuffer;

          if (actGapAfter < reqGapAfter) {
            isValid = false;
          } else {
            gapAfter = actGapAfter - reqGapAfter;
          }
        }

        if (isValid) {
          const minGap = Math.min(gapBefore, gapAfter);
          let confidence: 'Green' | 'Amber' | 'Red';
          let reason: string;

          if (minGap === Infinity) {
            confidence = 'Green';
            reason = 'No surrounding appointments on this day.';
          } else if (minGap >= 30) {
            confidence = 'Green';
            reason = `Sufficient gap to surrounding appointments (gap is ${Math.round(minGap)}m above minimum buffer).`;
          } else if (minGap >= 15) {
            confidence = 'Amber';
            reason = `Moderate gap to surrounding appointments (gap is ${Math.round(minGap)}m above minimum buffer).`;
          } else {
            confidence = 'Red';
            reason = `Tight gap to surrounding appointments (gap is ${Math.round(minGap)}m above minimum buffer).`;
          }

          candidates.push({
            time: slotStart.toISOString(),
            travel: Math.round(predAppt ? travelBefore : 0),
            confidence,
            reason,
          });
        }

        current = new Date(current.getTime() + 15 * 60 * 1000);
      }
    }

    // Sort by slot start time ascending
    candidates.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    // Return next 5 slots
    return candidates.slice(0, 5);
  }
}
