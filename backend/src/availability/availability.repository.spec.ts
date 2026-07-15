import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityRepository } from './availability.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('AvailabilityRepository', () => {
  let repository: AvailabilityRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const mockPrisma = {
      availabilityWindow: {
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilityRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<AvailabilityRepository>(AvailabilityRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should call prisma findFirst with soft-deleted filtering', async () => {
      (prisma.availabilityWindow.findFirst as jest.Mock).mockResolvedValue(null);
      await repository.findById('1');
      expect(prisma.availabilityWindow.findFirst).toHaveBeenCalledWith({
        where: { id: '1', deletedAt: null },
        include: {
          affiliation: {
            include: {
              doctor: {
                include: { user: true },
              },
              hospital: true,
            },
          },
        },
      });
    });
  });
});
