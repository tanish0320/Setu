import { Test, TestingModule } from '@nestjs/testing';
import { EscalationService } from './escalation.service';
import { EmergenciesRepository } from './emergencies.repository';
import { RankingService } from './ranking.service';

describe('EscalationService', () => {
  let service: EscalationService;
  let repository: jest.Mocked<EmergenciesRepository>;
  let rankingService: jest.Mocked<RankingService>;
  let pushProvider: jest.Mocked<any>;
  let smsProvider: jest.Mocked<any>;
  let voiceProvider: jest.Mocked<any>;

  beforeEach(async () => {
    const mockRepo = {
      createAssignment: jest.fn(),
      createEscalationLog: jest.fn(),
      createTimelineEntry: jest.fn(),
      updateRequestStatus: jest.fn(),
      findRequestById: jest.fn(),
      getAssignmentsForRequest: jest.fn(),
      updateAssignmentStatus: jest.fn(),
      findAlertedAssignments: jest.fn(),
      hasSmsLogSince: jest.fn(),
      hasVoiceLogSince: jest.fn(),
    };

    const mockRanking = {
      rankDoctors: jest.fn(),
    };

    const mockPush = { sendPush: jest.fn().mockResolvedValue(true) };
    const mockSms = { sendSms: jest.fn().mockResolvedValue(true) };
    const mockVoice = { sendVoiceCall: jest.fn().mockResolvedValue(true) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EscalationService,
        { provide: EmergenciesRepository, useValue: mockRepo },
        { provide: RankingService, useValue: mockRanking },
        { provide: 'PushProvider', useValue: mockPush },
        { provide: 'SmsProvider', useValue: mockSms },
        { provide: 'VoiceProvider', useValue: mockVoice },
      ],
    }).compile();

    service = module.get<EscalationService>(EscalationService);
    repository = module.get(EmergenciesRepository);
    rankingService = module.get(RankingService);
    pushProvider = module.get('PushProvider');
    smsProvider = module.get('SmsProvider');
    voiceProvider = module.get('VoiceProvider');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('alertDoctor', () => {
    it('should create assignment, send push, and log it', async () => {
      const mockAssignment = {
        id: 'assign-1',
        doctorId: 'doc-1',
        doctor: {
          userId: 'user-1',
          user: { name: 'Dr. John' },
        },
        emergencyRequest: {
          specialty: 'Cardiology',
          urgency: 'Critical',
        },
      };
      repository.createAssignment.mockResolvedValue(mockAssignment as any);

      await service.alertDoctor('req-1', 'doc-1', 1);

      expect(repository.createAssignment).toHaveBeenCalledWith('req-1', 'doc-1', 'Alerted');
      expect(pushProvider.sendPush).toHaveBeenCalled();
      expect(repository.createEscalationLog).toHaveBeenCalledWith('req-1', 'Push', expect.any(String));
      expect(repository.createTimelineEntry).toHaveBeenCalledWith('req-1', 'Notified', 'system', expect.any(String));
      expect(repository.updateRequestStatus).toHaveBeenCalledWith('req-1', 'Alerting');
    });
  });

  describe('escalateToNext', () => {
    it('should escalate to the next ranked doctor who has not been tried', async () => {
      const mockRequest = { id: 'req-1', hospitalId: 'hosp-1', specialty: 'Cardiology' };
      repository.findRequestById.mockResolvedValue(mockRequest as any);
      
      // Tried doctors: doc-1
      repository.getAssignmentsForRequest.mockResolvedValue([
        { doctorId: 'doc-1' },
      ] as any);

      // Ranked doctors: doc-1 (rank 1), doc-2 (rank 2)
      rankingService.rankDoctors.mockResolvedValue([
        { doctorId: 'doc-1', rank: 1 },
        { doctorId: 'doc-2', rank: 2 },
      ] as any);

      // Spy alertDoctor
      const alertDoctorSpy = jest.spyOn(service, 'alertDoctor').mockResolvedValue(undefined as any);

      await service.escalateToNext('req-1');

      expect(alertDoctorSpy).toHaveBeenCalledWith('req-1', 'doc-2', 2);
    });

    it('should expire request if we already tried 10 doctors', async () => {
      const mockRequest = { id: 'req-1', hospitalId: 'hosp-1', specialty: 'Cardiology' };
      repository.findRequestById.mockResolvedValue(mockRequest as any);

      // Tried 10 doctors
      repository.getAssignmentsForRequest.mockResolvedValue(
        Array.from({ length: 10 }, (_, i) => ({ doctorId: `doc-${i}` })) as any
      );

      await service.escalateToNext('req-1');

      expect(repository.updateRequestStatus).toHaveBeenCalledWith('req-1', 'Expired');
      expect(repository.createTimelineEntry).toHaveBeenCalledWith('req-1', 'Expired', 'system', expect.any(String));
    });

    it('should expire request if no more eligible doctors exist', async () => {
      const mockRequest = { id: 'req-1', hospitalId: 'hosp-1', specialty: 'Cardiology' };
      repository.findRequestById.mockResolvedValue(mockRequest as any);
      repository.getAssignmentsForRequest.mockResolvedValue([{ doctorId: 'doc-1' }] as any);
      rankingService.rankDoctors.mockResolvedValue([{ doctorId: 'doc-1', rank: 1 }] as any); // no new doctors

      await service.escalateToNext('req-1');

      expect(repository.updateRequestStatus).toHaveBeenCalledWith('req-1', 'Expired');
      expect(repository.createTimelineEntry).toHaveBeenCalledWith('req-1', 'Expired', 'system', expect.any(String));
    });
  });

  describe('checkEscalations', () => {
    it('should do nothing if elapsed time is less than 30 seconds', async () => {
      const alertedAt = new Date(); // now
      repository.findAlertedAssignments.mockResolvedValue([
        {
          id: 'assign-1',
          emergencyRequestId: 'req-1',
          notifiedAt: alertedAt,
          doctor: { user: { name: 'Dr. John' } },
        },
      ] as any);

      await service.checkEscalations();

      expect(repository.updateAssignmentStatus).not.toHaveBeenCalled();
      expect(smsProvider.sendSms).not.toHaveBeenCalled();
      expect(voiceProvider.sendVoiceCall).not.toHaveBeenCalled();
    });

    it('should trigger SMS after 30 seconds if not already sent', async () => {
      const alertedAt = new Date(Date.now() - 35000); // 35 seconds ago
      repository.findAlertedAssignments.mockResolvedValue([
        {
          id: 'assign-1',
          emergencyRequestId: 'req-1',
          notifiedAt: alertedAt,
          doctor: { user: { name: 'Dr. John' } },
        },
      ] as any);
      repository.hasSmsLogSince.mockResolvedValue(false);

      await service.checkEscalations();

      expect(smsProvider.sendSms).toHaveBeenCalled();
      expect(repository.createEscalationLog).toHaveBeenCalledWith('req-1', 'SMS', expect.any(String));
      expect(repository.createTimelineEntry).toHaveBeenCalledWith('req-1', 'Escalation', 'system', expect.any(String));
    });

    it('should trigger Voice after 60 seconds if not already sent', async () => {
      const alertedAt = new Date(Date.now() - 65000); // 65 seconds ago
      repository.findAlertedAssignments.mockResolvedValue([
        {
          id: 'assign-1',
          emergencyRequestId: 'req-1',
          notifiedAt: alertedAt,
          doctor: { user: { name: 'Dr. John' } },
        },
      ] as any);
      repository.hasSmsLogSince.mockResolvedValue(true); // SMS already sent
      repository.hasVoiceLogSince.mockResolvedValue(false); // Voice not sent

      await service.checkEscalations();

      expect(voiceProvider.sendVoiceCall).toHaveBeenCalled();
      expect(repository.createEscalationLog).toHaveBeenCalledWith('req-1', 'Voice', expect.any(String));
    });

    it('should timeout and escalate after 120 seconds', async () => {
      const alertedAt = new Date(Date.now() - 125000); // 125 seconds ago
      repository.findAlertedAssignments.mockResolvedValue([
        {
          id: 'assign-1',
          emergencyRequestId: 'req-1',
          notifiedAt: alertedAt,
          doctor: { user: { name: 'Dr. John' } },
        },
      ] as any);

      const escalateSpy = jest.spyOn(service, 'escalateToNext').mockResolvedValue(undefined);

      await service.checkEscalations();

      expect(repository.updateAssignmentStatus).toHaveBeenCalledWith('assign-1', 'Timeout', expect.any(Number));
      expect(repository.createTimelineEntry).toHaveBeenCalledWith('req-1', 'Timeout', 'system', expect.any(String));
      expect(repository.createEscalationLog).toHaveBeenCalledWith('req-1', 'Escalate', expect.any(String));
      expect(escalateSpy).toHaveBeenCalledWith('req-1');
    });
  });
});
