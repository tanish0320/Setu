import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AvailabilityModule } from './availability.module';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuditLogModule } from '../audit-log/audit-log.module';

describe('AvailabilityController (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const mockPrisma = {
      availabilityWindow: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      doctorHospitalAffiliation: {
        findUnique: jest.fn(),
      },
    };

    const mockAudit = {
      log: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AvailabilityModule, AuditLogModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .overrideProvider(AuditLogService)
      .useValue(mockAudit)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: 'admin-id', name: 'Admin User', role: { name: 'Super Admin', permissions: ['all'] } };
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

  it('/availability (GET)', () => {
    return request(app.getHttpServer())
      .get('/availability')
      .expect(200)
      .expect({ items: [], total: 0, page: 1, limit: 10 });
  });
});
