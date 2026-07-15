import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppointmentsModule } from './appointments.module';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuditLogModule } from '../audit-log/audit-log.module';

describe('AppointmentsController (Integration)', () => {
  let app: INestApplication;
  let prisma: any;

  beforeEach(async () => {
    const mockPrisma = {
      appointment: {
        create: jest.fn().mockResolvedValue({ id: 'appt-1', status: 'Pending', hospitalId: 'hosp-1' }),
        update: jest.fn().mockResolvedValue({ id: 'appt-1', status: 'Confirmed', hospitalId: 'hosp-1' }),
        findFirst: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
      doctorHospitalAffiliation: {
        findFirst: jest.fn().mockResolvedValue({ id: 'aff-1' }),
      },
      availabilityWindow: {
        findMany: jest.fn().mockResolvedValue([{ startTime: '09:00', endTime: '17:00' }]),
      },
      doctor: {
        findFirst: jest.fn().mockResolvedValue({ id: 'doc-1', defaultBuffer: 10 }),
      },
      hospital: {
        findUnique: jest.fn().mockImplementation((args) => {
          return { id: args.where.id, x: 10, y: 10, name: 'Hospital' };
        }),
      },
      appointmentStatusHistory: {
        create: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    const mockAudit = {
      log: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppointmentsModule, AuditLogModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .overrideProvider(AuditLogService)
      .useValue(mockAudit)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: 'user-1', name: 'Dr. John', role: { name: 'Doctor', permissions: ['appointments:create', 'appointments:read', 'appointments:update', 'appointments:delete'] } };
          return true;
        },
      })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/appointments (GET)', () => {
    return request(app.getHttpServer())
      .get('/appointments')
      .expect(200)
      .expect({ items: [], total: 0, page: 1, limit: 10 });
  });

  it('/appointments/calendar (GET)', () => {
    return request(app.getHttpServer())
      .get('/appointments/calendar?view=day&date=2026-07-15')
      .expect(200)
      .expect((res) => {
        expect(res.body.view).toBe('day');
        expect(res.body.appointments).toEqual([]);
      });
  });

  it('/appointments/suggestions (GET)', () => {
    prisma.doctorHospitalAffiliation.findFirst.mockResolvedValue({ id: 'aff-1' });
    prisma.availabilityWindow.findMany.mockResolvedValue([
      { startTime: '09:00', endTime: '10:00' },
    ]);
    prisma.appointment.findMany.mockResolvedValue([]);
    prisma.doctor.findFirst.mockResolvedValue({ defaultBuffer: 5 });

    return request(app.getHttpServer())
      .get('/appointments/suggestions?doctorId=d0c10c10-e89b-12d3-a456-426614174000&hospitalId=a0c10c10-e89b-12d3-a456-426614174000&duration=30&targetDate=2026-07-15')
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].confidence).toBe('Green');
      });
  });

  it('/appointments/conflicts (GET)', () => {
    prisma.doctorHospitalAffiliation.findFirst.mockResolvedValue({ id: 'aff-1' });
    prisma.availabilityWindow.findMany.mockResolvedValue([
      { startTime: '09:00', endTime: '17:00' },
    ]);
    prisma.appointment.findMany.mockResolvedValue([]);
    prisma.doctor.findFirst.mockResolvedValue({ defaultBuffer: 10 });

    return request(app.getHttpServer())
      .get('/appointments/conflicts?doctorId=d0c10c10-e89b-12d3-a456-426614174000&hospitalId=a0c10c10-e89b-12d3-a456-426614174000&scheduledStart=2026-07-15T09:00:00.000Z&scheduledEnd=2026-07-15T09:30:00.000Z')
      .expect(200)
      .expect({ conflicts: [] });
  });

  it('/appointments (POST)', () => {
    prisma.doctorHospitalAffiliation.findFirst.mockResolvedValue({ id: 'aff-1' });
    prisma.availabilityWindow.findMany.mockResolvedValue([
      { startTime: '09:00', endTime: '17:00' },
    ]);
    prisma.appointment.findMany.mockResolvedValue([]);
    prisma.doctor.findFirst.mockResolvedValue({ defaultBuffer: 10 });

    const postData = {
      doctorId: 'd0c10c10-e89b-12d3-a456-426614174000',
      hospitalId: 'a0c10c10-e89b-12d3-a456-426614174000',
      patientName: 'Jane Smith',
      scheduledStart: '2026-07-15T09:00:00.000Z',
      scheduledEnd: '2026-07-15T09:30:00.000Z',
    };

    return request(app.getHttpServer())
      .post('/appointments')
      .send(postData)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBe('appt-1');
      });
  });

  it('/appointments/:id (PATCH)', () => {
    prisma.appointment.findFirst.mockResolvedValue({
      id: 'appt-1',
      status: 'Pending',
      hospitalId: 'hosp-1',
      scheduledStart: new Date('2026-07-15T09:00:00.000Z'),
      scheduledEnd: new Date('2026-07-15T09:30:00.000Z'),
    });

    return request(app.getHttpServer())
      .patch('/appointments/appt-1')
      .send({ status: 'Confirmed' })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('Confirmed');
      });
  });

  it('/appointments/:id (DELETE)', () => {
    prisma.appointment.findFirst.mockResolvedValue({ id: 'appt-1', hospitalId: 'hosp-1' });

    return request(app.getHttpServer())
      .delete('/appointments/appt-1')
      .expect(200)
      .expect({ success: true, message: 'Appointment soft deleted successfully.' });
  });
});
