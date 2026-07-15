import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { EmergenciesRepository } from './emergencies.repository';
import { RankingService } from './ranking.service';
import type { PushProvider } from './providers/push.provider';
import type { SmsProvider } from './providers/sms.provider';
import type { VoiceProvider } from './providers/voice.provider';

@Injectable()
export class EscalationService {
  constructor(
    private readonly repository: EmergenciesRepository,
    private readonly rankingService: RankingService,
    @Inject('PushProvider') private readonly pushProvider: PushProvider,
    @Inject('SmsProvider') private readonly smsProvider: SmsProvider,
    @Inject('VoiceProvider') private readonly voiceProvider: VoiceProvider,
  ) {}

  async alertDoctor(requestId: string, doctorId: string, rank: number) {
    const assignment = await this.repository.createAssignment(requestId, doctorId, 'Alerted');
    const doctor = assignment.doctor;
    const message = `Emergency Request! Specialty required: ${assignment.emergencyRequest.specialty}. Urgency: ${assignment.emergencyRequest.urgency}`;
    
    // 1. Send push
    await this.pushProvider.sendPush(doctor.userId, 'Emergency Dispatch', message);

    // 2. Log escalation action
    await this.repository.createEscalationLog(
      requestId,
      'Push',
      `Immediate Push notification sent to doctor ${doctor.user.name} (Rank #${rank})`,
    );

    // 3. Log timeline entry
    await this.repository.createTimelineEntry(
      requestId,
      'Notified',
      'system',
      `Alerted doctor ${doctor.user.name} (Rank #${rank})`,
    );

    // 4. Update request status to Alerting
    await this.repository.updateRequestStatus(requestId, 'Alerting');
  }

  async escalateToNext(requestId: string) {
    const request = await this.repository.findRequestById(requestId);
    if (!request) return;

    // Get all assignments for this request to track tried doctor IDs
    const assignments = await this.repository.getAssignmentsForRequest(requestId);
    const triedDoctorIds = assignments.map((a) => a.doctorId);

    // Maximum limit of 10 doctors
    if (triedDoctorIds.length >= 10) {
      await this.repository.updateRequestStatus(requestId, 'Expired');
      await this.repository.createTimelineEntry(
        requestId,
        'Expired',
        'system',
        'Max escalation limit of 10 doctors reached',
      );
      await this.repository.createEscalationLog(
        requestId,
        'Escalate',
        'Max escalation limit of 10 doctors reached. Request expired.',
      );
      return;
    }

    // Rank doctors for the request
    const ranked = await this.rankingService.rankDoctors(request.hospitalId, request.specialty);

    // Find the next eligible doctor who hasn't been tried yet
    const nextRanked = ranked.find((r) => !triedDoctorIds.includes(r.doctorId));

    if (nextRanked) {
      await this.alertDoctor(requestId, nextRanked.doctorId, nextRanked.rank);
    } else {
      // No more eligible doctors
      await this.repository.updateRequestStatus(requestId, 'Expired');
      await this.repository.createTimelineEntry(
        requestId,
        'Expired',
        'system',
        'No more eligible doctors available',
      );
      await this.repository.createEscalationLog(
        requestId,
        'Escalate',
        'No more eligible doctors available. Request expired.',
      );
    }
  }

  async checkEscalations() {
    const alertedAssignments = await this.repository.findAlertedAssignments();
    const now = new Date();

    for (const assignment of alertedAssignments) {
      const notifiedAt = new Date(assignment.notifiedAt);
      const elapsedSeconds = (now.getTime() - notifiedAt.getTime()) / 1000;
      const requestId = assignment.emergencyRequestId;
      const doctor = assignment.doctor;

      if (elapsedSeconds >= 120) {
        // 1. Timeout current assignment
        await this.repository.updateAssignmentStatus(assignment.id, 'Timeout', elapsedSeconds);

        // 2. Timeline entry
        await this.repository.createTimelineEntry(
          requestId,
          'Timeout',
          'system',
          `Doctor ${doctor.user.name} timed out after ${elapsedSeconds.toFixed(1)} seconds`,
        );

        // 3. Escalation Log
        await this.repository.createEscalationLog(
          requestId,
          'Escalate',
          `Timeout. Escalating from doctor ${doctor.user.name}.`,
        );

        // 4. Escalate to the next doctor
        await this.escalateToNext(requestId);
      } else {
        // If elapsed >= 30, check and send SMS
        if (elapsedSeconds >= 30) {
          const smsSent = await this.repository.hasSmsLogSince(requestId, notifiedAt);
          if (!smsSent) {
            const message = `Urgent Emergency Request! Doctor ${doctor.user.name}, please respond immediately.`;
            await this.smsProvider.sendSms('+15555555555', message);

            await this.repository.createEscalationLog(
              requestId,
              'SMS',
              `SMS notification dispatched to doctor ${doctor.user.name}`,
            );

            await this.repository.createTimelineEntry(
              requestId,
              'Escalation',
              'system',
              `SMS alert sent to doctor ${doctor.user.name}`,
            );
          }
        }

        // If elapsed >= 60, check and send Voice call
        if (elapsedSeconds >= 60) {
          const voiceSent = await this.repository.hasVoiceLogSince(requestId, notifiedAt);
          if (!voiceSent) {
            const message = `Urgent Emergency Request! Doctor ${doctor.user.name}, please respond immediately.`;
            await this.voiceProvider.sendVoiceCall('+15555555555', message);

            await this.repository.createEscalationLog(
              requestId,
              'Voice',
              `Voice call dispatched to doctor ${doctor.user.name}`,
            );

            await this.repository.createTimelineEntry(
              requestId,
              'Escalation',
              'system',
              `Voice alert sent to doctor ${doctor.user.name}`,
            );
          }
        }
      }
    }
  }
}
