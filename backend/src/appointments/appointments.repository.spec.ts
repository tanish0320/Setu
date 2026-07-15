import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsRepository } from './appointments.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('AppointmentsRepository', () => {
  let repository: AppointmentsRepository;
  let prisma: any;

  beforeEach(async () => {
    const mockPrisma = {
      appointment: {
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
      doctorHospitalAffiliation: {
        findFirst: jest.fn(),
      },
      availabilityWindow: {
        findMany: jest.fn(),
      },
      appointmentStatusHistory: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      doctor: {
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<AppointmentsRepository>(AppointmentsRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should call prisma.appointment.create with correct data', async () => {
      const data: any = { doctorId: 'doc-1', hospitalId: 'hosp-1', patientName: 'John' };
      await repository.create(data);
      expect(prisma.appointment.create).toHaveBeenCalledWith({
        data,
        include: {
          doctor: { include: { user: true } },
          hospital: true,
        },
      });
    });
  });

  describe('update', () => {
    it('should call prisma.appointment.update with correct parameters', async () => {
      const data: any = { patientName: 'Jane' };
      await repository.update('appt-1', data);
      expect(prisma.appointment.update).toHaveBeenCalledWith({
        where: { id: 'appt-1' },
        data,
        include: {
          doctor: { include: { user: true } },
          hospital: true,
        },
      });
    });
  });
});
