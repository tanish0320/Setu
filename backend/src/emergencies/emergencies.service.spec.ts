import { Test, TestingModule } from '@nestjs/testing';
import { EmergenciesService } from './emergencies.service';
import { EmergenciesRepository } from './emergencies.repository';
import { RankingService } from './ranking.service';
import { EscalationService } from './escalation.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { DoctorStatusService } from '../doctor-status/doctor-status.service';

describe('EmergenciesService', () => {
  let service: EmergenciesService;
  let repository: jest.Mocked<EmergenciesRepository>;
  let rankingService: jest.Mocked<RankingService>;
  let escalationService: jest.Mocked<EscalationService>;
  let auditLogService: jest.Mocked<AuditLogService>;
  let doctorStatusService: jest.Mocked<DoctorStatusService>;

  const mockActor = {
    name: 'Hospital Coordinator',
    role: 'Staff',
    ip: '127.0.0.1',
    device: 'Web App',
    hospital: 'hosp-1',
  };

  const mockRequest = {
    id: 'req-1',
    hospitalId: 'hosp-1',
    specialty: 'Cardiology',
    urgency: 'Critical',
    patientSummary: 'Chest pain',
    status: 'Searching',
    hospital: { name: 'Hospital One' },
    assignments: [],
  };

  beforeEach(async () => {
    const mockRepo = {
      createRequest: jest.fn(),
      findRequestById: jest.fn(),
      findDoctorByUserId: jest.fn(),
      findActiveAssignmentForDoctor: jest.fn(),
      updateAssignmentStatus: jest.fn(),
      acceptRequest: jest.fn(),
      completeRequest: jest.fn(),
      cancelRequest: jest.fn(),
      updateRequestStatus: jest.fn(),
      createTimelineEntry: jest.fn(),
      listRequests: jest.fn(),
      getEscalations: jest.fn(),
    };

    const mockRanking = {
      rankDoctors: jest.fn(),
    };

    const mockEscalation = {
      alertDoctor: jest.fn(),
      escalateToNext: jest.fn(),
    };

    const mockAudit = {
      log: jest.fn(),
    };

    const mockDoctorStatus = {
      transitionOnEmergencyAccept: jest.fn(),
      transitionOnEmergencyComplete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmergenciesService,
        { provide: EmergenciesRepository, useValue: mockRepo },
        { provide: RankingService, useValue: mockRanking },
        { provide: EscalationService, useValue: mockEscalation },
        { provide: AuditLogService, useValue: mockAudit },
        { provide: DoctorStatusService, useValue: mockDoctorStatus },
      ],
    }).compile();

    service = module.get<EmergenciesService>(EmergenciesService);
    repository = module.get(EmergenciesRepository);
    rankingService = module.get(RankingService);
    escalationService = module.get(EscalationService);
    auditLogService = module.get(AuditLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create emergency request, rank, and alert Rank #1', async () => {
      repository.createRequest.mockResolvedValue(mockRequest as any);
      rankingService.rankDoctors.mockResolvedValue([
        { doctorId: 'doc-1', rank: 1, score: 95 } as any,
      ]);
      repository.findRequestById.mockResolvedValue(mockRequest as any);

      const dto = { hospitalId: 'hosp-1', specialty: 'Cardiology', urgency: 'Critical', patientSummary: 'Chest pain' };
      const result = await service.create(dto, mockActor);

      expect(repository.createRequest).toHaveBeenCalledWith(dto, mockActor.name);
      expect(repository.createTimelineEntry).toHaveBeenCalledWith(mockRequest.id, 'Created', mockActor.name, expect.any(String));
      expect(rankingService.rankDoctors).toHaveBeenCalledWith('hosp-1', 'Cardiology');
      expect(repository.createTimelineEntry).toHaveBeenCalledWith(mockRequest.id, 'Ranked', 'system', expect.any(String));
      expect(escalationService.alertDoctor).toHaveBeenCalledWith(mockRequest.id, 'doc-1', 1);
      expect(auditLogService.log).toHaveBeenCalledWith('EMERGENCY_CREATE', mockActor, null, mockRequest);
      expect(result).toEqual(mockRequest);
    });

    it('should set request status to Expired if no doctors are found', async () => {
      repository.createRequest.mockResolvedValue(mockRequest as any);
      rankingService.rankDoctors.mockResolvedValue([]);
      repository.findRequestById.mockResolvedValue({ ...mockRequest, status: 'Expired' } as any);

      const dto = { hospitalId: 'hosp-1', specialty: 'Cardiology', urgency: 'Critical' };
      const result = await service.create(dto, mockActor);

      expect(repository.updateRequestStatus).toHaveBeenCalledWith(mockRequest.id, 'Expired');
      expect(repository.createTimelineEntry).toHaveBeenCalledWith(mockRequest.id, 'Expired', 'system', expect.any(String));
      expect(escalationService.alertDoctor).not.toHaveBeenCalled();
      expect(result.status).toBe('Expired');
    });
  });

  describe('accept', () => {
    it('should throw ForbiddenException if user is not a doctor', async () => {
      repository.findDoctorByUserId.mockResolvedValue(null);
      await expect(
        service.accept('req-1', { responseMode: 'Physical Visit', eta: 15 }, { id: 'user-1' }, mockActor),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if doctor has no active alert', async () => {
      repository.findDoctorByUserId.mockResolvedValue({ id: 'doc-1', user: { name: 'Dr. John' } } as any);
      repository.findActiveAssignmentForDoctor.mockResolvedValue(null);

      await expect(
        service.accept('req-1', { responseMode: 'Physical Visit', eta: 15 }, { id: 'user-1' }, mockActor),
      ).rejects.toThrow(BadRequestException);
    });

    it('should successfully accept, update request and assignment status', async () => {
      const mockDoctor = { id: 'doc-1', user: { name: 'Dr. John' } };
      repository.findDoctorByUserId.mockResolvedValue(mockDoctor as any);
      repository.findActiveAssignmentForDoctor.mockResolvedValue({
        id: 'assign-1',
        notifiedAt: new Date(Date.now() - 10000),
      } as any);

      const preAcceptRequest = { ...mockRequest, assignments: [{ id: 'assign-1', status: 'Alerted' }] };
      repository.findRequestById.mockResolvedValue(preAcceptRequest as any);

      await service.accept('req-1', { responseMode: 'Physical Visit', eta: 15 }, { id: 'user-1' }, mockActor);

      expect(repository.updateAssignmentStatus).toHaveBeenCalledWith('assign-1', 'Accepted', expect.any(Number));
      expect(repository.acceptRequest).toHaveBeenCalledWith('req-1', 'doc-1', 'Physical Visit', 15);
      expect(repository.createTimelineEntry).toHaveBeenCalledWith(
        'req-1',
        'Accepted',
        'Dr. John',
        expect.stringContaining('Physical Visit'),
      );
      expect(auditLogService.log).toHaveBeenCalledWith('EMERGENCY_ACCEPT', mockActor, preAcceptRequest, expect.any(Object));
    });
  });

  describe('decline', () => {
    it('should decline alert, log it, and trigger next escalation', async () => {
      const mockDoctor = { id: 'doc-1', user: { name: 'Dr. John' } };
      repository.findDoctorByUserId.mockResolvedValue(mockDoctor as any);
      repository.findActiveAssignmentForDoctor.mockResolvedValue({
        id: 'assign-1',
        notifiedAt: new Date(),
      } as any);

      repository.findRequestById.mockResolvedValue(mockRequest as any);

      await service.decline('req-1', { id: 'user-1' }, mockActor);

      expect(repository.updateAssignmentStatus).toHaveBeenCalledWith('assign-1', 'Declined', expect.any(Number));
      expect(repository.createTimelineEntry).toHaveBeenCalledWith('req-1', 'Declined', 'Dr. John', expect.any(String));
      expect(auditLogService.log).toHaveBeenCalledWith('EMERGENCY_DECLINE', mockActor, mockRequest, null);
      expect(escalationService.escalateToNext).toHaveBeenCalledWith('req-1');
    });
  });

  describe('cancel', () => {
    it('should throw NotFoundException if request not found', async () => {
      repository.findRequestById.mockResolvedValue(null);
      await expect(service.cancel('invalid-id', mockActor)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if request is already completed/cancelled/expired', async () => {
      repository.findRequestById.mockResolvedValue({ ...mockRequest, status: 'Completed' } as any);
      await expect(service.cancel('req-1', mockActor)).rejects.toThrow(BadRequestException);
    });

    it('should cancel the request, cancel assignments, and write audit log', async () => {
      const activeRequest = {
        ...mockRequest,
        status: 'Alerting',
        assignments: [{ id: 'assign-1', status: 'Alerted' }],
      };
      repository.findRequestById.mockResolvedValue(activeRequest as any);

      await service.cancel('req-1', mockActor);

      expect(repository.cancelRequest).toHaveBeenCalledWith('req-1');
      expect(repository.updateAssignmentStatus).toHaveBeenCalledWith('assign-1', 'Declined');
      expect(repository.createTimelineEntry).toHaveBeenCalledWith('req-1', 'Cancelled', mockActor.name, expect.any(String));
      expect(auditLogService.log).toHaveBeenCalledWith('EMERGENCY_CANCEL', mockActor, activeRequest, expect.any(Object));
    });
  });

  describe('complete', () => {
    it('should throw BadRequestException if request status is not Accepted or Travelling', async () => {
      repository.findRequestById.mockResolvedValue({ ...mockRequest, status: 'Alerting' } as any);
      await expect(service.complete('req-1', mockActor)).rejects.toThrow(BadRequestException);
    });

    it('should complete the request and log timeline and audit', async () => {
      const acceptedRequest = { ...mockRequest, status: 'Accepted' };
      repository.findRequestById.mockResolvedValue(acceptedRequest as any);

      await service.complete('req-1', mockActor);

      expect(repository.completeRequest).toHaveBeenCalledWith('req-1');
      expect(repository.createTimelineEntry).toHaveBeenCalledWith('req-1', 'Completed', mockActor.name, expect.any(String));
      expect(auditLogService.log).toHaveBeenCalledWith('EMERGENCY_COMPLETE', mockActor, acceptedRequest, expect.any(Object));
    });
  });
});
