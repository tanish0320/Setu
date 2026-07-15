import { Injectable, BadRequestException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';
import { ConflictDetectionService } from './conflict-detection.service';
import { AuditLogService, AuditActor } from '../audit-log/audit-log.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { QueryAppointmentDto } from './dto/query-appointment.dto';
import { PreviewConflictsDto } from './dto/preview-conflicts.dto';
import { DoctorStatusService } from '../doctor-status/doctor-status.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly repo: AppointmentsRepository,
    private readonly conflictService: ConflictDetectionService,
    private readonly auditLogService: AuditLogService,
    @Inject(forwardRef(() => DoctorStatusService))
    private readonly doctorStatusService: DoctorStatusService,
  ) {}

  private isTransitionAllowed(prev: string, next: string): boolean {
    if (prev === next) return true;
    if (prev === 'Pending') {
      return next === 'Confirmed' || next === 'Cancelled';
    }
    if (prev === 'Confirmed') {
      return next === 'In Progress' || next === 'Cancelled' || next === 'No Show';
    }
    if (prev === 'In Progress') {
      return next === 'Completed' || next === 'No Show';
    }
    return false;
  }

  async create(dto: CreateAppointmentDto, actor: AuditActor) {
    const start = new Date(dto.scheduledStart);
    const end = new Date(dto.scheduledEnd);

    if (start >= end) {
      throw new BadRequestException('scheduledStart must be before scheduledEnd.');
    }

    const conflicts = await this.conflictService.checkConflicts(
      dto.doctorId,
      dto.hospitalId,
      start,
      end,
    );

    if (conflicts.length > 0) {
      if (dto.conflictOverride && dto.overrideReason) {
        // Allowed by override
      } else {
        throw new BadRequestException({
          message: 'Appointment booking has conflicts.',
          conflicts,
        });
      }
    }

    const appointment = await this.repo.create({
      doctorId: dto.doctorId,
      hospitalId: dto.hospitalId,
      patientName: dto.patientName,
      patientPhone: dto.patientPhone,
      patientId: dto.patientId,
      appointmentType: dto.appointmentType,
      scheduledStart: start,
      scheduledEnd: end,
      notes: dto.notes,
      conflictOverride: dto.conflictOverride ?? false,
      overrideReason: dto.overrideReason,
      status: 'Pending',
      bookedBy: actor.name,
    });

    // Record initial status in history
    await this.repo.createStatusHistory({
      appointmentId: appointment.id,
      prevStatus: null,
      newStatus: 'Pending',
      actor: actor.name || 'system',
      hospitalId: appointment.hospitalId,
    });

    // Audit log
    await this.auditLogService.log(
      'appointments:create',
      actor,
      null,
      appointment,
    );

    return appointment;
  }

  async update(id: string, dto: UpdateAppointmentDto, actor: AuditActor) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Appointment with ID ${id} not found.`);
    }

    const start = dto.scheduledStart ? new Date(dto.scheduledStart) : existing.scheduledStart;
    const end = dto.scheduledEnd ? new Date(dto.scheduledEnd) : existing.scheduledEnd;

    if (start >= end) {
      throw new BadRequestException('scheduledStart must be before scheduledEnd.');
    }

    // 1. Conflict checking if reschedule or resource changes
    const checkConflictsRequired =
      dto.scheduledStart ||
      dto.scheduledEnd ||
      dto.doctorId ||
      dto.hospitalId;

    if (checkConflictsRequired) {
      const docId = dto.doctorId ?? existing.doctorId;
      const hospId = dto.hospitalId ?? existing.hospitalId;

      const conflicts = await this.conflictService.checkConflicts(
        docId,
        hospId,
        start,
        end,
        id,
      );

      if (conflicts.length > 0) {
        const override = dto.conflictOverride ?? existing.conflictOverride;
        const reason = dto.overrideReason ?? existing.overrideReason;

        if (override && reason) {
          // Override allowed
        } else {
          throw new BadRequestException({
            message: 'Appointment reschedule or change has conflicts.',
            conflicts,
          });
        }
      }
    }

    // 2. Status Transition check
    let statusChanged = false;
    let oldStatus = existing.status;
    let newStatus = existing.status;

    if (dto.status && dto.status !== existing.status) {
      if (!this.isTransitionAllowed(existing.status, dto.status)) {
        throw new BadRequestException(`Status transition from ${existing.status} to ${dto.status} is not allowed.`);
      }
      statusChanged = true;
      newStatus = dto.status;
    }

    const dataToUpdate: any = {
      doctorId: dto.doctorId,
      hospitalId: dto.hospitalId,
      patientName: dto.patientName,
      patientPhone: dto.patientPhone,
      patientId: dto.patientId,
      appointmentType: dto.appointmentType,
      scheduledStart: dto.scheduledStart ? start : undefined,
      scheduledEnd: dto.scheduledEnd ? end : undefined,
      notes: dto.notes,
      conflictOverride: dto.conflictOverride,
      overrideReason: dto.overrideReason,
      status: dto.status,
    };

    if (newStatus === 'Confirmed' && oldStatus !== 'Confirmed') {
      dataToUpdate.confirmedBy = actor.name;
    }

    if (newStatus === 'In Progress' && oldStatus !== 'In Progress') {
      dataToUpdate.actualStart = new Date();
    }

    if (newStatus === 'Completed' && oldStatus !== 'Completed') {
      dataToUpdate.actualEnd = new Date();
    }

    const updatedAppointment = await this.repo.update(id, dataToUpdate);

    // 3. Write status history if changed
    if (statusChanged) {
      await this.repo.createStatusHistory({
        appointmentId: id,
        prevStatus: oldStatus,
        newStatus,
        actor: actor.name || 'system',
        hospitalId: updatedAppointment.hospitalId,
      });

      // Trigger Doctor Live Status transitions
      try {
        if (newStatus === 'In Progress') {
          await this.doctorStatusService.transitionOnAppointmentStart(
            updatedAppointment.doctorId,
            updatedAppointment.hospitalId,
          );
        } else if (newStatus === 'Completed') {
          const nextAppt = await this.repo.findNextAppointment(
            updatedAppointment.doctorId,
            updatedAppointment.scheduledEnd,
          );
          const nextHospitalId = nextAppt ? nextAppt.hospitalId : updatedAppointment.hospitalId;
          await this.doctorStatusService.transitionOnAppointmentEnd(
            updatedAppointment.doctorId,
            updatedAppointment.hospitalId,
            nextHospitalId,
          );
        }
      } catch (err) {
        // Log error but do not block appointment status updates
      }
    }

    // Audit log
    await this.auditLogService.log(
      'appointments:update',
      actor,
      existing,
      updatedAppointment,
    );

    return updatedAppointment;
  }

  async remove(id: string, actor: AuditActor) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Appointment with ID ${id} not found.`);
    }

    await this.repo.softDelete(id);

    // Audit log
    await this.auditLogService.log(
      'appointments:delete',
      actor,
      existing,
      { id, deletedAt: new Date() },
    );

    return { success: true, message: 'Appointment soft deleted successfully.' };
  }

  async findOne(id: string) {
    const appointment = await this.repo.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found.`);
    }
    return appointment;
  }

  async findAll(query: QueryAppointmentDto) {
    return this.repo.findAll(query);
  }

  async previewConflicts(dto: PreviewConflictsDto) {
    const start = new Date(dto.scheduledStart);
    const end = new Date(dto.scheduledEnd);

    if (start >= end) {
      throw new BadRequestException('scheduledStart must be before scheduledEnd.');
    }

    const conflicts = await this.conflictService.checkConflicts(
      dto.doctorId,
      dto.hospitalId,
      start,
      end,
      dto.excludeAppointmentId,
    );

    return {
      conflicts,
    };
  }
}
