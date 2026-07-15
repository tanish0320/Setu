import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsRepository } from './departments.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('DepartmentsRepository', () => {
  let repository: DepartmentsRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const mockPrisma = {
      department: {
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentsRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<DepartmentsRepository>(DepartmentsRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should call prisma findFirst with soft-deleted filtering', async () => {
      (prisma.department.findFirst as jest.Mock).mockResolvedValue(null);
      await repository.findById('1');
      expect(prisma.department.findFirst).toHaveBeenCalledWith({
        where: { id: '1', deletedAt: null },
        include: { hospital: true, head: true },
      });
    });
  });
});
