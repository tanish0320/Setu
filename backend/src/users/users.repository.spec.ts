import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const mockPrisma = {
      user: {
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should call prisma findFirst with soft-deleted filtering and role relation inclusion', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      await repository.findById('user-id');
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { id: 'user-id', deletedAt: null },
        include: { role: true },
      });
    });
  });
});
