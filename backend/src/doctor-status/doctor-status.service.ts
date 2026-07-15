import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  forwardRef,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { DoctorStatusRepository } from './doctor-status.repository';
import { TravelService } from '../appointments/travel/travel.service';
import { DoctorStatusGateway } from './doctor-status.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDoctorStatusDto } from './dto/query-doctor-status.dto';

function isValidTransition(
  current: string,
  target: string,
  context: 'manual' | 'startAppointment' | 'endAppointment' | 'acceptEmergency' | 'completeEmergency' | 'disconnect',
): boolean {
  if (current === target) return true;

  if (context === 'disconnect') {
    return target === 'Offline';
  }

  if (context === 'acceptEmergency') {
    return target === 'Emergency Active';
  }

  if (context === 'completeEmergency') {
    return current === 'Emergency Active';
  }

  if (current === 'Emergency Active') {
    return false;
  }

  if (context === 'startAppointment') {
    return current === 'Available' && target === 'In Consultation';
  }

  if (context === 'endAppointment') {
    if (current !== 'In Consultation') return false;
    return target === 'In Transit' || target === 'Available';
  }

  if (context === 'manual') {
    if (['In Consultation', 'In Transit', 'Emergency Active'].includes(target)) {
      return false;
    }
    if (current === 'In Consultation') {
      return false;
    }
    return ['Available', 'On Break', 'Unavailable', 'Offline'].includes(target);
  }

  return false;
}

@Injectable()
export class DoctorStatusService implements OnModuleInit, OnModuleDestroy {
  private etaInterval: NodeJS.Timeout | null = null;

  constructor(
    private readonly repo: DoctorStatusRepository,
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => TravelService))
    private readonly travelService: TravelService,
    @Inject(forwardRef(() => DoctorStatusGateway))
    private readonly gateway: DoctorStatusGateway,
  ) {}

  onModuleInit() {
    this.etaInterval = setInterval(async () => {
      try {
        await this.decrementETAs();
      } catch (err) {
        // Prevent background loop error from crashing the process
      }
    }, 60000);
  }

  onModuleDestroy() {
    if (this.etaInterval) {
      clearInterval(this.etaInterval);
      this.etaInterval = null;
    }
  }

  async getOrCreateStatus(doctorId: string) {
    const existing = await this.repo.findByDoctorId(doctorId);
    if (existing) return existing;

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
    }

    const defaultData = {
      doctorId,
      status: 'Offline',
      currentHospitalId: null,
      nextHospitalId: null,
      previousStatus: null,
      etaMinutes: null,
      x: null,
      y: null,
      progress: 0,
    };
    return this.repo.upsert(doctorId, {}, defaultData);
  }

  async transitionOnAppointmentStart(doctorId: string, hospitalId: string) {
    const statusRow = await this.getOrCreateStatus(doctorId);
    const current = statusRow.status;
    const target = 'In Consultation';

    if (!isValidTransition(current, target, 'startAppointment')) {
      throw new BadRequestException(`Cannot transition from ${current} to ${target} on appointment start.`);
    }

    const updated = await this.repo.upsert(
      doctorId,
      {
        status: target,
        currentHospitalId: hospitalId,
        nextHospitalId: null,
        etaMinutes: null,
        progress: 0,
      },
      {
        doctorId,
        status: target,
        currentHospitalId: hospitalId,
      },
    );

    await this.repo.createHistory({
      doctorId,
      status: target,
      reason: 'Appointment started',
      actor: 'system',
    });

    await this.gateway.broadcastStatusChange(updated);
    return updated;
  }

  async transitionOnAppointmentEnd(doctorId: string, currentHospitalId: string, nextHospitalId: string) {
    const statusRow = await this.getOrCreateStatus(doctorId);
    const current = statusRow.status;

    let target = 'Available';
    let etaMinutes = null;

    if (nextHospitalId && nextHospitalId !== currentHospitalId) {
      target = 'In Transit';
      try {
        const travelTime = await this.travelService.getTravelTimeBetweenHospitals(
          currentHospitalId,
          nextHospitalId,
        );
        etaMinutes = Math.ceil(travelTime);
      } catch (err) {
        etaMinutes = 15; // default fallback
      }
    }

    if (!isValidTransition(current, target, 'endAppointment')) {
      throw new BadRequestException(`Cannot transition from ${current} to ${target} on appointment end.`);
    }

    const updated = await this.repo.upsert(
      doctorId,
      {
        status: target,
        currentHospitalId: target === 'In Transit' ? null : nextHospitalId || currentHospitalId,
        nextHospitalId: target === 'In Transit' ? nextHospitalId : null,
        etaMinutes,
        progress: 0,
      },
      {
        doctorId,
        status: target,
        currentHospitalId: target === 'In Transit' ? null : nextHospitalId || currentHospitalId,
        nextHospitalId: target === 'In Transit' ? nextHospitalId : null,
        etaMinutes,
      },
    );

    await this.repo.createHistory({
      doctorId,
      status: target,
      reason: target === 'In Transit' ? `Travel to next hospital started (ETA: ${etaMinutes} mins)` : 'Appointment ended, available',
      actor: 'system',
    });

    await this.gateway.broadcastStatusChange(updated);
    return updated;
  }

  async transitionOnEmergencyAccept(doctorId: string) {
    const statusRow = await this.getOrCreateStatus(doctorId);
    const current = statusRow.status;
    const target = 'Emergency Active';

    if (!isValidTransition(current, target, 'acceptEmergency')) {
      throw new BadRequestException(`Cannot transition from ${current} to ${target} on emergency accept.`);
    }

    const updated = await this.repo.upsert(
      doctorId,
      {
        status: target,
        previousStatus: current,
      },
      {
        doctorId,
        status: target,
        previousStatus: current,
      },
    );

    await this.repo.createHistory({
      doctorId,
      status: target,
      reason: 'Emergency request accepted',
      actor: 'system',
    });

    await this.gateway.broadcastEmergencyAccepted(doctorId);
    await this.gateway.broadcastStatusChange(updated);
    return updated;
  }

  async transitionOnEmergencyComplete(doctorId: string) {
    const statusRow = await this.getOrCreateStatus(doctorId);
    const current = statusRow.status;
    const target = statusRow.previousStatus || 'Available';

    if (!isValidTransition(current, target, 'completeEmergency')) {
      throw new BadRequestException(`Cannot transition from ${current} to ${target} on emergency complete.`);
    }

    const updated = await this.repo.upsert(
      doctorId,
      {
        status: target,
        previousStatus: null,
      },
      {
        doctorId,
        status: target,
      },
    );

    await this.repo.createHistory({
      doctorId,
      status: target,
      reason: 'Emergency completed',
      actor: 'system',
    });

    await this.gateway.broadcastEmergencyCompleted(doctorId, target);
    await this.gateway.broadcastStatusChange(updated);
    return updated;
  }

  async updateStatusManual(doctorId: string, targetStatus: string, reason?: string, actorName: string = 'doctor') {
    const statusRow = await this.getOrCreateStatus(doctorId);
    const current = statusRow.status;

    if (!isValidTransition(current, targetStatus, 'manual')) {
      throw new BadRequestException(`Cannot manually transition from ${current} to ${targetStatus}.`);
    }

    const updated = await this.repo.upsert(
      doctorId,
      {
        status: targetStatus,
        nextHospitalId: null,
        etaMinutes: null,
        progress: 0,
        previousStatus: null,
      },
      {
        doctorId,
        status: targetStatus,
      },
    );

    await this.repo.createHistory({
      doctorId,
      status: targetStatus,
      reason: reason || 'Manual update',
      actor: actorName,
    });

    await this.gateway.broadcastStatusChange(updated);
    return updated;
  }

  async handleDisconnect(doctorId: string) {
    const statusRow = await this.getOrCreateStatus(doctorId);
    const current = statusRow.status;
    const target = 'Offline';

    if (current === 'Offline') {
      return;
    }

    const updated = await this.repo.upsert(
      doctorId,
      {
        status: target,
        etaMinutes: null,
        progress: 0,
      },
      {
        doctorId,
        status: target,
      },
    );

    await this.repo.createHistory({
      doctorId,
      status: target,
      reason: 'Socket disconnected',
      actor: 'system',
    });

    await this.gateway.broadcastStatusChange(updated);
  }

  async decrementETAs() {
    const inTransitStatuses = await this.prisma.doctorStatus.findMany({
      where: {
        status: 'In Transit',
      },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    for (const statusRow of inTransitStatuses) {
      const currentEta = statusRow.etaMinutes ?? 0;
      const newEta = Math.max(0, currentEta - 1);

      if (newEta === 0) {
        const updated = await this.repo.upsert(
          statusRow.doctorId,
          {
            status: 'Available',
            currentHospitalId: statusRow.nextHospitalId,
            nextHospitalId: null,
            etaMinutes: null,
            progress: 100,
          },
          {
            doctorId: statusRow.doctorId,
            status: 'Available',
            currentHospitalId: statusRow.nextHospitalId,
          },
        );

        await this.repo.createHistory({
          doctorId: statusRow.doctorId,
          status: 'Available',
          reason: 'Transit completed, arrived at hospital',
          actor: 'system',
        });

        await this.gateway.broadcastDoctorArrived(statusRow.doctorId, statusRow.nextHospitalId!);
        await this.gateway.broadcastStatusChange(updated);
      } else {
        const updated = await this.repo.upsert(
          statusRow.doctorId,
          {
            etaMinutes: newEta,
          },
          {
            doctorId: statusRow.doctorId,
            status: 'In Transit',
            etaMinutes: newEta,
          },
        );

        await this.gateway.broadcastEtaUpdated(statusRow.doctorId, statusRow.nextHospitalId!, newEta);
        await this.gateway.broadcastStatusChange(updated);
      }
    }
  }

  applyMasking(status: any, hospitalId?: string): any {
    if (!status) return null;
    if (status.status === 'In Transit' && hospitalId) {
      if (status.nextHospitalId !== hospitalId) {
        const now = new Date();
        const eta = status.etaMinutes ?? 0;
        const targetTime = new Date(now.getTime() + eta * 60 * 1000);
        const hours = String(targetTime.getHours()).padStart(2, '0');
        const minutes = String(targetTime.getMinutes()).padStart(2, '0');
        return {
          id: status.id,
          doctorId: status.doctorId,
          status: 'Unavailable',
          displayMessage: `Unavailable until ${hours}:${minutes}`,
          currentHospitalId: null,
          nextHospitalId: null,
          previousStatus: status.previousStatus,
          etaMinutes: null,
          x: status.x,
          y: status.y,
          progress: status.progress,
          updatedAt: status.updatedAt,
          doctor: status.doctor,
        };
      }
    }
    return status;
  }

  async findAll(query: QueryDoctorStatusDto, requestHospitalId?: string) {
    const result = await this.repo.findAll(query);
    const hospitalId = requestHospitalId || query.hospitalId;
    result.items = result.items.map((item) => this.applyMasking(item, hospitalId));
    return result;
  }

  async findOne(id: string, requestHospitalId?: string) {
    let status = await this.repo.findById(id);
    if (!status) {
      status = await this.repo.findByDoctorId(id);
    }
    if (!status) {
      throw new NotFoundException(`DoctorStatus with ID or Doctor ID ${id} not found`);
    }
    return this.applyMasking(status, requestHospitalId);
  }

  async findHistory(doctorId: string) {
    // Verify doctor exists first
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
    }
    return this.repo.findHistoryByDoctorId(doctorId);
  }
}
