import { Test, TestingModule } from '@nestjs/testing';
import { HospitalsRepository } from './hospitals.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('HospitalsRepository', () => {
  let repository: HospitalsRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const mockPrisma = {
      hospital: {
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HospitalsRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<HospitalsRepository>(HospitalsRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should call prisma findFirst with soft-deleted filtering', async () => {
      (prisma.hospital.findFirst as jest.Mock).mockResolvedValue(null);
      await repository.findById('1');
      expect(prisma.hospital.findFirst).toHaveBeenCalledWith({
        where: { id: '1', deletedAt: null },
      });
    });
  });
});
