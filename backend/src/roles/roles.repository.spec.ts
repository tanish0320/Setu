import { Test, TestingModule } from '@nestjs/testing';
import { RolesRepository } from './roles.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('RolesRepository', () => {
  let repository: RolesRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const mockPrisma = {
      role: {
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<RolesRepository>(RolesRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should call prisma findFirst with soft-deleted filtering', async () => {
      (prisma.role.findFirst as jest.Mock).mockResolvedValue(null);
      await repository.findById('1');
      expect(prisma.role.findFirst).toHaveBeenCalledWith({
        where: { id: '1', deletedAt: null },
      });
    });
  });
});
