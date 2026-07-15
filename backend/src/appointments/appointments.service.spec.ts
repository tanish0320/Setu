import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { AppointmentsRepository } from './appointments.repository';
import { ConflictDetectionService } from './conflict-detection.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DoctorStatusService } from '../doctor-status/doctor-status.service';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let repo: any;
  let conflictService: any;
  let auditLogService: any;
  let doctorStatusService: any;

  const mockActor = { name: 'Dr. Smith', role: 'Doctor', hospital: 'hosp-1' };

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      softDelete: jest.fn(),
      createStatusHistory: jest.fn(),
    };

    const mockConflictService = {
      checkConflicts: jest.fn(),
    };

    const mockAuditLog = {
      log: jest.fn(),
    };

    const mockDoctorStatus = {
      transitionOnAppointmentStart: jest.fn(),
      transitionOnAppointmentEnd: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: AppointmentsRepository, useValue: mockRepo },
        { provide: ConflictDetectionService, useValue: mockConflictService },
        { provide: AuditLogService, useValue: mockAuditLog },
        { provide: DoctorStatusService, useValue: mockDoctorStatus },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    repo = module.get<AppointmentsRepository>(AppointmentsRepository);
    conflictService = module.get<ConflictDetectionService>(ConflictDetectionService);
    auditLogService = module.get<AuditLogService>(AuditLogService);
    doctorStatusService = module.get<DoctorStatusService>(DoctorStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      doctorId: 'doc-1',
      hospitalId: 'hosp-1',
      patientName: 'Alice',
      scheduledStart: '2026-07-15T09:00:00.000Z',
      scheduledEnd: '2026-07-15T09:30:00.000Z',
    };

    it('should create an appointment if no conflicts exist', async () => {
      conflictService.checkConflicts.mockResolvedValue([]);
      repo.create.mockResolvedValue({ id: 'appt-1', hospitalId: 'hosp-1', status: 'Pending' });

      const result = await service.create(dto, mockActor);

      expect(result.id).toBe('appt-1');
      expect(repo.create).toHaveBeenCalled();
      expect(repo.createStatusHistory).toHaveBeenCalledWith(
        expect.objectContaining({
          prevStatus: null,
          newStatus: 'Pending',
        }),
      );
      expect(auditLogService.log).toHaveBeenCalledWith(
        'appointments:create',
        mockActor,
        null,
        expect.any(Object),
      );
    });

    it('should throw BadRequestException if conflicts exist and override is false', async () => {
      conflictService.checkConflicts.mockResolvedValue([{ type: 'OVERLAP', message: 'Overlap' }]);

      await expect(service.create(dto, mockActor)).rejects.toThrow(BadRequestException);
    });

    it('should allow creation if conflicts exist but override is true with reason', async () => {
      conflictService.checkConflicts.mockResolvedValue([{ type: 'OVERLAP', message: 'Overlap' }]);
      repo.create.mockResolvedValue({ id: 'appt-1', hospitalId: 'hosp-1', status: 'Pending' });

      const dtoWithOverride = { ...dto, conflictOverride: true, overrideReason: 'Clinical emergency' };
      const result = await service.create(dtoWithOverride, mockActor);

      expect(result.id).toBe('appt-1');
      expect(repo.create).toHaveBeenCalled();
    });
  });

  describe('status transitions', () => {
    it('should reject invalid status transition (e.g. Pending -> Completed)', async () => {
      repo.findById.mockResolvedValue({ id: 'appt-1', status: 'Pending', hospitalId: 'hosp-1' });

      await expect(
        service.update('appt-1', { status: 'Completed' }, mockActor),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow valid status transitions (e.g. Pending -> Confirmed -> In Progress -> Completed)', async () => {
      repo.findById.mockResolvedValue({ id: 'appt-1', status: 'Pending', hospitalId: 'hosp-1' });
      repo.update.mockResolvedValue({ id: 'appt-1', status: 'Confirmed', hospitalId: 'hosp-1' });

      let result = await service.update('appt-1', { status: 'Confirmed' }, mockActor);
      expect(result.status).toBe('Confirmed');

      repo.findById.mockResolvedValue({ id: 'appt-1', status: 'Confirmed', hospitalId: 'hosp-1' });
      repo.update.mockResolvedValue({ id: 'appt-1', status: 'In Progress', hospitalId: 'hosp-1' });
      result = await service.update('appt-1', { status: 'In Progress' }, mockActor);
      expect(result.status).toBe('In Progress');

      repo.findById.mockResolvedValue({ id: 'appt-1', status: 'In Progress', hospitalId: 'hosp-1' });
      repo.update.mockResolvedValue({ id: 'appt-1', status: 'Completed', hospitalId: 'hosp-1' });
      result = await service.update('appt-1', { status: 'Completed' }, mockActor);
      expect(result.status).toBe('Completed');
    });

    it('should allow Pending -> Cancelled and Confirmed -> Cancelled', async () => {
      repo.findById.mockResolvedValue({ id: 'appt-1', status: 'Pending', hospitalId: 'hosp-1' });
      repo.update.mockResolvedValue({ id: 'appt-1', status: 'Cancelled', hospitalId: 'hosp-1' });
      let result = await service.update('appt-1', { status: 'Cancelled' }, mockActor);
      expect(result.status).toBe('Cancelled');

      repo.findById.mockResolvedValue({ id: 'appt-1', status: 'Confirmed', hospitalId: 'hosp-1' });
      result = await service.update('appt-1', { status: 'Cancelled' }, mockActor);
      expect(result.status).toBe('Cancelled');
    });

    it('should allow Confirmed -> No Show and In Progress -> No Show', async () => {
      repo.findById.mockResolvedValue({ id: 'appt-1', status: 'Confirmed', hospitalId: 'hosp-1' });
      repo.update.mockResolvedValue({ id: 'appt-1', status: 'No Show', hospitalId: 'hosp-1' });
      let result = await service.update('appt-1', { status: 'No Show' }, mockActor);
      expect(result.status).toBe('No Show');

      repo.findById.mockResolvedValue({ id: 'appt-1', status: 'In Progress', hospitalId: 'hosp-1' });
      result = await service.update('appt-1', { status: 'No Show' }, mockActor);
      expect(result.status).toBe('No Show');
    });
  });
});
