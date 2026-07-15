import { Test, TestingModule } from '@nestjs/testing';
import { DoctorsService } from './doctors.service';
import { DoctorsRepository } from './doctors.repository';
import { UsersRepository } from '../users/users.repository';
import { AuditLogService } from '../audit-log/audit-log.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('DoctorsService', () => {
  let service: DoctorsService;
  let repository: jest.Mocked<DoctorsRepository>;
  let usersRepository: jest.Mocked<UsersRepository>;
  let auditLogService: jest.Mocked<AuditLogService>;

  const mockActor = { name: 'Admin', role: 'Super Admin' };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findAll: jest.fn(),
      softDelete: jest.fn(),
    };

    const mockUsersRepo = {
      findById: jest.fn(),
    };

    const mockAudit = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorsService,
        { provide: DoctorsRepository, useValue: mockRepository },
        { provide: UsersRepository, useValue: mockUsersRepo },
        { provide: AuditLogService, useValue: mockAudit },
      ],
    }).compile();

    service = module.get<DoctorsService>(DoctorsService);
    repository = module.get(DoctorsRepository);
    usersRepository = module.get(UsersRepository);
    auditLogService = module.get(AuditLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      usersRepository.findById.mockResolvedValue(null);
      const dto = { userId: 'user-1', specialty: 'Cardiology' };
      await expect(service.create(dto, mockActor)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if doctor profile already exists for user', async () => {
      usersRepository.findById.mockResolvedValue({ id: 'user-1' } as any);
      repository.findByUserId.mockResolvedValue({ id: 'doc-1' } as any);
      const dto = { userId: 'user-1', specialty: 'Cardiology' };
      await expect(service.create(dto, mockActor)).rejects.toThrow(BadRequestException);
    });
  });
});
