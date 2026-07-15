import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { EmergenciesModule } from './emergencies.module';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

describe('EmergenciesController (Integration)', () => {
  let app: INestApplication;
  let prisma: any;

  const mockHospital = {
    id: 'hosp-1',
    name: 'General Hospital',
    x: 0,
    y: 0,
    subscriptionStatus: 'active',
  };

  const mockDoctor = {
    id: 'doc-1',
    userId: 'user-doc-1',
    specialty: 'Cardiology',
    emergencyOptIn: true,
    travelRadius: 15,
    deletedAt: null,
    user: {
      id: 'user-doc-1',
      email: 'doctor@test.com',
      name: 'Dr. Smith',
      isActive: true,
      deletedAt: null,
    },
    status: {
      status: 'Available',
      currentHospitalId: 'hosp-1',
    },
    hospitals: [
      {
        hospitalId: 'hosp-1',
        isPrimary: true,
        hospital: { id: 'hosp-1', x: 0, y: 0 },
      },
    ],
    appointments: [],
    emergencyAssignments: [],
  };

  const mockDoctor2 = {
    id: 'doc-2',
    userId: 'user-doc-2',
    specialty: 'Cardiology',
    emergencyOptIn: true,
    travelRadius: 15,
    deletedAt: null,
    user: {
      id: 'user-doc-2',
      email: 'doctor2@test.com',
      name: 'Dr. Jones',
      isActive: true,
      deletedAt: null,
    },
    status: {
      status: 'Available',
      currentHospitalId: 'hosp-1',
    },
    hospitals: [
      {
        hospitalId: 'hosp-1',
        isPrimary: true,
        hospital: { id: 'hosp-1', x: 0, y: 0 },
      },
    ],
    appointments: [],
    emergencyAssignments: [],
  };


  const mockRequestRecord = {
    id: 'req-123',
    hospitalId: 'hosp-1',
    specialty: 'Cardiology',
    urgency: 'Critical',
    patientSummary: 'Chest pain',
    status: 'Alerting',
    createdBy: 'Test Coordinator',
    hospital: { name: 'General Hospital' },
    assignments: [
      {
        id: 'assign-1',
        emergencyRequestId: 'req-123',
        doctorId: 'doc-1',
        status: 'Alerted',
        notifiedAt: new Date(),
        doctor: {
          id: 'doc-1',
          userId: 'user-doc-1',
          user: { name: 'Dr. Smith' },
        },
      },
    ],
    timeline: [],
    escalations: [],
  };

  beforeEach(async () => {
    // Reset the mock record status to prevent test pollution
    mockRequestRecord.status = 'Alerting';
    delete (mockRequestRecord as any).acceptedDoctorId;
    delete (mockRequestRecord as any).responseMode;
    delete (mockRequestRecord as any).eta;
    delete (mockRequestRecord as any).acceptedAt;
    delete (mockRequestRecord as any).completedAt;

    const mockPrisma = {
      hospital: {
        findUnique: jest.fn().mockImplementation(({ where }) => {
          if (where.id === 'hosp-1') return Promise.resolve(mockHospital);
          return Promise.resolve(null);
        }),
      },
      doctor: {
        findMany: jest.fn().mockResolvedValue([mockDoctor, mockDoctor2]),
        findUnique: jest.fn().mockImplementation(({ where }) => {
          if (where.userId === 'doctor-user-id' || where.userId === 'user-doc-1') {
            return Promise.resolve(mockDoctor);
          }
          return Promise.resolve(null);
        }),
      },
      emergencyRequest: {
        create: jest.fn().mockResolvedValue(mockRequestRecord),
        findUnique: jest.fn().mockImplementation(({ where }) => {
          if (where.id === 'req-123') return Promise.resolve(mockRequestRecord);
          return Promise.resolve(null);
        }),
        findMany: jest.fn().mockResolvedValue({
          items: [mockRequestRecord],
          total: 1,
        }),
        count: jest.fn().mockResolvedValue(1),
        update: jest.fn().mockImplementation(({ where, data }) => {
          Object.assign(mockRequestRecord, data);
          return Promise.resolve(mockRequestRecord);
        }),
      },
      emergencyAssignment: {
        create: jest.fn().mockResolvedValue({
          id: 'assign-1',
          doctorId: 'doc-1',
          status: 'Alerted',
          notifiedAt: new Date(),
          doctor: {
            userId: 'user-doc-1',
            user: { name: 'Dr. Smith' },
          },
          emergencyRequest: {
            specialty: 'Cardiology',
            urgency: 'Critical',
          },
        }),
        findFirst: jest.fn().mockResolvedValue({
          id: 'assign-1',
          doctorId: 'doc-1',
          status: 'Alerted',
          notifiedAt: new Date(Date.now() - 5000),
        }),
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'assign-1',
            doctorId: 'doc-1',
            status: 'Alerted',
            notifiedAt: new Date(),
            doctor: {
              userId: 'user-doc-1',
              user: { name: 'Dr. Smith' },
            },
            emergencyRequest: {
              id: 'req-123',
              status: 'Alerting',
            },
          },
        ]),
        update: jest.fn().mockResolvedValue({ id: 'assign-1', status: 'Accepted' }),
      },
      emergencyTimeline: {
        create: jest.fn().mockResolvedValue({}),
        findMany: jest.fn().mockResolvedValue([]),
      },
      emergencyEscalationLog: {
        create: jest.fn().mockResolvedValue({}),
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
      auditLog: {
        create: jest.fn().mockResolvedValue({}),
      },
    };

    const mockAudit = {
      log: jest.fn().mockResolvedValue({}),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EmergenciesModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .overrideProvider(AuditLogService)
      .useValue(mockAudit)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = {
            id: 'doctor-user-id',
            name: 'Dr. Smith',
            role: { name: 'Doctor', permissions: ['all'] },
          };
          return true;
        },
      })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('POST /emergencies - should create emergency and trigger alerts', async () => {
    const payload = {
      hospitalId: 'hosp-1',
      specialty: 'Cardiology',
      urgency: 'Critical',
      patientSummary: 'Chest pain',
    };

    const res = await request(app.getHttpServer())
      .post('/emergencies')
      .send(payload)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toBe('Alerting');
    expect(prisma.emergencyRequest.create).toHaveBeenCalled();
  });

  it('PATCH /emergencies/:id/accept - should accept active emergency assignment', async () => {
    const payload = {
      responseMode: 'Physical Visit',
      eta: 15,
    };

    const res = await request(app.getHttpServer())
      .patch('/emergencies/req-123/accept')
      .send(payload)
      .expect(200);

    expect(res.body.acceptedDoctorId).toBe('doc-1');
    expect(prisma.emergencyAssignment.update).toHaveBeenCalled();
    expect(prisma.emergencyRequest.update).toHaveBeenCalled();
  });

  it('PATCH /emergencies/:id/decline - should decline active emergency assignment', async () => {
    const res = await request(app.getHttpServer())
      .patch('/emergencies/req-123/decline')
      .expect(200);

    expect(prisma.emergencyAssignment.update).toHaveBeenCalled();
    expect(prisma.emergencyAssignment.create).toHaveBeenCalled(); // escalates to next doctor
  });

  it('POST /emergencies/check-escalations - should run checkEscalations successfully', async () => {
    const res = await request(app.getHttpServer())
      .post('/emergencies/check-escalations')
      .expect(200);

    expect(res.body.message).toBe('Escalation check triggered successfully');
  });

  it('PATCH /emergencies/:id/cancel - should cancel active request', async () => {
    const res = await request(app.getHttpServer())
      .patch('/emergencies/req-123/cancel')
      .expect(200);

    expect(prisma.emergencyRequest.update).toHaveBeenCalled();
  });
});
