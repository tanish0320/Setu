import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { DoctorStatusModule } from './doctor-status.module';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { AuditLogService } from '../audit-log/audit-log.service';

describe('DoctorStatusController (Integration)', () => {
  let app: INestApplication;
  let mockPrisma: any;

  beforeEach(async () => {
    mockPrisma = {
      doctorStatus: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'status-1',
          doctorId: 'doc-1',
          status: 'Available',
          currentHospitalId: 'hosp-1',
          nextHospitalId: null,
          etaMinutes: null,
          x: null,
          y: null,
          progress: 0,
        }),
        upsert: jest.fn().mockImplementation((args) => {
          return Promise.resolve({
            id: 'status-1',
            doctorId: args.where.doctorId,
            status: args.update.status || 'Available',
            currentHospitalId: args.update.currentHospitalId || null,
            nextHospitalId: args.update.nextHospitalId || null,
            etaMinutes: args.update.etaMinutes || null,
            x: null,
            y: null,
            progress: args.update.progress || 0,
          });
        }),
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
      doctorStatusHistory: {
        create: jest.fn().mockResolvedValue({ id: 'hist-1' }),
        findMany: jest.fn().mockResolvedValue([]),
      },
      statusEvent: {
        create: jest.fn().mockResolvedValue({ id: 'event-1' }),
      },
      doctor: {
        findUnique: jest.fn().mockResolvedValue({ id: 'doc-1' }),
        findFirst: jest.fn().mockResolvedValue({ id: 'doc-1' }),
      },
      hospital: {
        findMany: jest.fn().mockResolvedValue([{ id: 'hosp-1' }, { id: 'hosp-2' }]),
        findUnique: jest.fn().mockResolvedValue({ id: 'hosp-1', x: 0, y: 0 }),
      },
      appointment: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
      auditLog: {
        create: jest.fn(),
      },
    };

    const mockAudit = {
      log: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DoctorStatusModule],
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
            id: 'user-1',
            name: 'Dr. Jones',
            role: { name: 'Doctor', permissions: ['doctor-status:read', 'doctor-status:update'] },
          };
          return true;
        },
      })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /doctor-status should return status list', async () => {
    mockPrisma.doctorStatus.findMany.mockResolvedValue([
      {
        id: 'status-1',
        doctorId: 'doc-1',
        status: 'Available',
        updatedAt: new Date(),
        doctor: { user: { name: 'Dr. John' } },
      },
    ]);
    mockPrisma.doctorStatus.count.mockResolvedValue(1);

    const response = await request(app.getHttpServer())
      .get('/doctor-status')
      .expect(200);

    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].status).toBe('Available');
  });

  it('GET /doctor-status/:id should return specific status', async () => {
    const response = await request(app.getHttpServer())
      .get('/doctor-status/status-1')
      .expect(200);

    expect(response.body.doctorId).toBe('doc-1');
    expect(response.body.status).toBe('Available');
  });

  it('PATCH /doctor-status/:id should manually update status', async () => {
    const response = await request(app.getHttpServer())
      .patch('/doctor-status/doc-1')
      .send({ status: 'On Break', reason: 'Rest' })
      .expect(200);

    expect(response.body.status).toBe('On Break');
  });

  it('PATCH /doctor-status/:id should return 400 for invalid status', async () => {
    await request(app.getHttpServer())
      .patch('/doctor-status/doc-1')
      .send({ status: 'In Consultation' })
      .expect(400);
  });

  it('GET /doctor-status/:id/history should return change history', async () => {
    mockPrisma.doctorStatusHistory.findMany.mockResolvedValue([
      { id: 'hist-1', doctorId: 'doc-1', status: 'Available', changedAt: new Date() },
    ]);

    const response = await request(app.getHttpServer())
      .get('/doctor-status/doc-1/history')
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].status).toBe('Available');
  });
});
