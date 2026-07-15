import { Test, TestingModule } from '@nestjs/testing';
import { EmergenciesRepository } from './emergencies.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('EmergenciesRepository', () => {
  let repository: EmergenciesRepository;
  let prisma: any;

  beforeEach(async () => {
    const mockPrisma = {
      emergencyRequest: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
      },
      doctor: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
      hospital: {
        findUnique: jest.fn(),
      },
      emergencyAssignment: {
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
      emergencyEscalationLog: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
      emergencyTimeline: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      auditLog: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmergenciesRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<EmergenciesRepository>(EmergenciesRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createRequest', () => {
    it('should call prisma.emergencyRequest.create with correct data', async () => {
      const dto = { hospitalId: 'hosp-1', specialty: 'Cardiology', urgency: 'Critical', patientSummary: 'Summary' };
      prisma.emergencyRequest.create.mockResolvedValue({ id: '1' });

      await repository.createRequest(dto, 'User A');

      expect(prisma.emergencyRequest.create).toHaveBeenCalledWith({
        data: {
          hospitalId: 'hosp-1',
          specialty: 'Cardiology',
          urgency: 'Critical',
          patientSummary: 'Summary',
          status: 'Searching',
          createdBy: 'User A',
        },
        include: {
          hospital: true,
          assignments: true,
        },
      });
    });
  });

  describe('findDoctorByUserId', () => {
    it('should query prisma.doctor.findUnique with correct fields', async () => {
      await repository.findDoctorByUserId('user-1');

      expect(prisma.doctor.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: { user: true },
      });
    });
  });

  describe('updateRequestStatus', () => {
    it('should call prisma.emergencyRequest.update with status', async () => {
      await repository.updateRequestStatus('req-1', 'Alerting');

      expect(prisma.emergencyRequest.update).toHaveBeenCalledWith({
        where: { id: 'req-1' },
        data: { status: 'Alerting' },
      });
    });
  });

  describe('createAssignment', () => {
    it('should call prisma.emergencyAssignment.create', async () => {
      await repository.createAssignment('req-1', 'doc-1', 'Alerted');

      expect(prisma.emergencyAssignment.create).toHaveBeenCalledWith({
        data: {
          emergencyRequestId: 'req-1',
          doctorId: 'doc-1',
          status: 'Alerted',
          notifiedAt: expect.any(Date),
        },
        include: {
          doctor: {
            include: {
              user: true,
            },
          },
          emergencyRequest: true,
        },
      });
    });
  });

  describe('createTimelineEntry', () => {
    it('should call prisma.emergencyTimeline.create', async () => {
      await repository.createTimelineEntry('req-1', 'Created', 'system', 'Details');

      expect(prisma.emergencyTimeline.create).toHaveBeenCalledWith({
        data: {
          emergencyRequestId: 'req-1',
          action: 'Created',
          actor: 'system',
          details: 'Details',
        },
      });
    });
  });
});
