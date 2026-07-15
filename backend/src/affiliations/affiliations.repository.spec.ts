import { Test, TestingModule } from '@nestjs/testing';
import { AffiliationsRepository } from './affiliations.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('AffiliationsRepository', () => {
  let repository: AffiliationsRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const mockPrisma = {
      doctorHospitalAffiliation: {
        create: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AffiliationsRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<AffiliationsRepository>(AffiliationsRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByDoctorAndHospital', () => {
    it('should query unique combination doctorId_hospitalId', async () => {
      (prisma.doctorHospitalAffiliation.findUnique as jest.Mock).mockResolvedValue(null);
      await repository.findByDoctorAndHospital('doc-1', 'hosp-1');
      expect(prisma.doctorHospitalAffiliation.findUnique).toHaveBeenCalledWith({
        where: {
          doctorId_hospitalId: {
            doctorId: 'doc-1',
            hospitalId: 'hosp-1',
          },
        },
        include: { doctor: true, hospital: true, availabilityWindows: true },
      });
    });
  });
});
