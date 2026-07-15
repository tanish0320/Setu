import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { EmergenciesRepository } from './emergencies.repository';
import { RankingService } from './ranking.service';
import { EscalationService } from './escalation.service';
import { AuditLogService, AuditActor } from '../audit-log/audit-log.service';
import { CreateEmergencyDto } from './dto/create-emergency.dto';
import { QueryEmergencyDto } from './dto/query-emergency.dto';
import { AcceptEmergencyDto } from './dto/accept-emergency.dto';
import { DoctorStatusService } from '../doctor-status/doctor-status.service';

@Injectable()
export class EmergenciesService {
  constructor(
    private readonly repository: EmergenciesRepository,
    private readonly rankingService: RankingService,
    private readonly escalationService: EscalationService,
    private readonly auditLogService: AuditLogService,
    private readonly doctorStatusService: DoctorStatusService,
  ) {}

  async create(dto: CreateEmergencyDto, actor: AuditActor) {
    // 1. Create the emergency request record
    const request = await this.repository.createRequest(dto, actor.name);

    // 2. Timeline Created entry
    await this.repository.createTimelineEntry(
      request.id,
      'Created',
      actor.name || 'system',
      `Emergency request created for hospital ${request.hospital.name}`,
    );

    // 3. Rank doctors
    const rankedDoctors = await this.rankingService.rankDoctors(dto.hospitalId, dto.specialty);

    await this.repository.createTimelineEntry(
      request.id,
      'Ranked',
      'system',
      `Found ${rankedDoctors.length} eligible doctors for specialty ${dto.specialty}`,
    );

    // 4. Alert rank #1 doctor or set Expired if none
    if (rankedDoctors.length > 0) {
      const rank1 = rankedDoctors[0];
      await this.escalationService.alertDoctor(request.id, rank1.doctorId, 1);
    } else {
      await this.repository.updateRequestStatus(request.id, 'Expired');
      await this.repository.createTimelineEntry(
        request.id,
        'Expired',
        'system',
        'No eligible doctors found initially',
      );
    }

    // 5. Write Audit Log
    const updatedRequest = await this.repository.findRequestById(request.id);
    await this.auditLogService.log('EMERGENCY_CREATE', actor, null, updatedRequest);

    return updatedRequest;
  }

  async findAll(queryDto: QueryEmergencyDto) {
    return this.repository.listRequests(queryDto);
  }

  async findOne(id: string) {
    const request = await this.repository.findRequestById(id);
    if (!request) {
      throw new NotFoundException(`Emergency request with ID ${id} not found`);
    }
    return request;
  }

  async accept(id: string, acceptDto: AcceptEmergencyDto, doctorUser: any, actor: AuditActor) {
    const doctor = await this.repository.findDoctorByUserId(doctorUser.id);
    if (!doctor) {
      throw new ForbiddenException('User profile does not contain a doctor record');
    }

    const assignment = await this.repository.findActiveAssignmentForDoctor(id, doctor.id);
    if (!assignment) {
      throw new BadRequestException('No active alert found for this doctor on this emergency request');
    }

    // Calculate response latency
    const notifiedAt = new Date(assignment.notifiedAt);
    const latencySeconds = (new Date().getTime() - notifiedAt.getTime()) / 1000;

    // 1. Update assignment to Accepted
    await this.repository.updateAssignmentStatus(assignment.id, 'Accepted', latencySeconds);

    // 2. Decline other alerted/pending assignments if any (standard cleanup, though there should only be one active)
    const request = await this.repository.findRequestById(id);
    if (request) {
      for (const a of request.assignments) {
        if (a.id !== assignment.id && a.status === 'Alerted') {
          await this.repository.updateAssignmentStatus(a.id, 'Declined');
        }
      }
    }

    // 3. Update request status, acceptedDoctorId, responseMode, eta, acceptedAt
    await this.repository.acceptRequest(id, doctor.id, acceptDto.responseMode, acceptDto.eta);

    // Transition doctor live status to Emergency Active
    try {
      await this.doctorStatusService.transitionOnEmergencyAccept(doctor.id);
    } catch (err) {
      // Log or ignore
    }

    // 4. Create timeline entry
    await this.repository.createTimelineEntry(
      id,
      'Accepted',
      doctor.user.name,
      `Accepted via ${acceptDto.responseMode} with ETA ${acceptDto.eta} mins`,
    );

    // 5. Audit Log
    const updatedRequest = await this.repository.findRequestById(id);
    await this.auditLogService.log('EMERGENCY_ACCEPT', actor, request, updatedRequest);

    return updatedRequest;
  }

  async decline(id: string, doctorUser: any, actor: AuditActor) {
    const doctor = await this.repository.findDoctorByUserId(doctorUser.id);
    if (!doctor) {
      throw new ForbiddenException('User profile does not contain a doctor record');
    }

    const assignment = await this.repository.findActiveAssignmentForDoctor(id, doctor.id);
    if (!assignment) {
      throw new BadRequestException('No active alert found for this doctor on this emergency request');
    }

    const notifiedAt = new Date(assignment.notifiedAt);
    const latencySeconds = (new Date().getTime() - notifiedAt.getTime()) / 1000;

    // 1. Update assignment to Declined
    await this.repository.updateAssignmentStatus(assignment.id, 'Declined', latencySeconds);

    // 2. Timeline entry
    await this.repository.createTimelineEntry(
      id,
      'Declined',
      doctor.user.name,
      'Declined emergency request',
    );

    // 3. Audit Log
    const prevRequest = await this.repository.findRequestById(id);
    await this.auditLogService.log('EMERGENCY_DECLINE', actor, prevRequest, null);

    // 4. Immediately trigger next escalation
    await this.escalationService.escalateToNext(id);

    return this.repository.findRequestById(id);
  }

  async cancel(id: string, actor: AuditActor) {
    const request = await this.repository.findRequestById(id);
    if (!request) {
      throw new NotFoundException(`Emergency request with ID ${id} not found`);
    }

    if (['Completed', 'Cancelled', 'Expired'].includes(request.status)) {
      throw new BadRequestException(`Cannot cancel request in status ${request.status}`);
    }

    // 1. Cancel request (marks status and soft-deletes)
    await this.repository.cancelRequest(id);

    // 2. Update active assignments to Declined/Cancelled
    for (const assignment of request.assignments) {
      if (assignment.status === 'Alerted' || assignment.status === 'Pending') {
        await this.repository.updateAssignmentStatus(assignment.id, 'Declined');
      }
    }

    // 3. Timeline entry
    await this.repository.createTimelineEntry(
      id,
      'Cancelled',
      actor.name || 'system',
      'Emergency request cancelled',
    );

    // 4. Audit Log
    const updatedRequest = await this.repository.findRequestById(id);
    await this.auditLogService.log('EMERGENCY_CANCEL', actor, request, updatedRequest);

    return updatedRequest;
  }

  async complete(id: string, actor: AuditActor) {
    const request = await this.repository.findRequestById(id);
    if (!request) {
      throw new NotFoundException(`Emergency request with ID ${id} not found`);
    }

    if (request.status !== 'Accepted' && request.status !== 'Travelling') {
      throw new BadRequestException(`Cannot complete emergency request in status ${request.status}`);
    }

    // 1. Complete request
    await this.repository.completeRequest(id);

    // Transition doctor live status back to previous status
    if (request.acceptedDoctorId) {
      try {
        await this.doctorStatusService.transitionOnEmergencyComplete(request.acceptedDoctorId);
      } catch (err) {
        // Log or ignore
      }
    }

    // 2. Timeline entry
    await this.repository.createTimelineEntry(
      id,
      'Completed',
      actor.name || 'system',
      'Emergency intervention completed',
    );

    // 3. Audit Log
    const updatedRequest = await this.repository.findRequestById(id);
    await this.auditLogService.log('EMERGENCY_COMPLETE', actor, request, updatedRequest);

    return updatedRequest;
  }

  async getEscalationLogs(id: string) {
    const request = await this.repository.findRequestById(id);
    if (!request) {
      throw new NotFoundException(`Emergency request with ID ${id} not found`);
    }
    return this.repository.getEscalations(id);
  }
}
