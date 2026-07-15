import { Test, TestingModule } from '@nestjs/testing';
import { DoctorsRepository } from './doctors.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('DoctorsRepository', () => {
  let repository: DoctorsRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const mockPrisma = {
      doctor: {
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorsRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<DoctorsRepository>(DoctorsRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should call prisma findFirst with soft-deleted filtering', async () => {
      (prisma.doctor.findFirst as jest.Mock).mockResolvedValue(null);
      await repository.findById('1');
      expect(prisma.doctor.findFirst).toHaveBeenCalledWith({
        where: { id: '1', deletedAt: null },
        include: { user: true },
      });
    });
  });
});
