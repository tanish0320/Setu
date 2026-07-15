import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { RolesRepository } from './roles.repository';
import { AuditLogService } from '../audit-log/audit-log.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('RolesService', () => {
  let service: RolesService;
  let repository: jest.Mocked<RolesRepository>;
  let auditLogService: jest.Mocked<AuditLogService>;
  let prismaService: jest.Mocked<PrismaService>;

  const mockActor = {
    name: 'Test Actor',
    role: 'Admin',
    ip: '127.0.0.1',
    device: 'Jest Test',
  };

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      softDelete: jest.fn(),
    };

    const mockAudit = {
      log: jest.fn(),
    };

    const mockPrisma = {
      user: {
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: RolesRepository, useValue: mockRepo },
        { provide: AuditLogService, useValue: mockAudit },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    repository = module.get(RolesRepository);
    auditLogService = module.get(AuditLogService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw BadRequestException if role name already exists', async () => {
      repository.findByName.mockResolvedValue({
        id: '1',
        name: 'Admin',
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      await expect(
        service.create({ name: 'Admin', permissions: [] }, mockActor),
      ).rejects.toThrow(BadRequestException);
    });

    it('should successfully create a role and write audit log', async () => {
      repository.findByName.mockResolvedValue(null);
      const roleResult = {
        id: '1',
        name: 'Admin',
        permissions: ['users:read'],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      repository.create.mockResolvedValue(roleResult);

      const result = await service.create({ name: 'Admin', permissions: ['users:read'] }, mockActor);

      expect(result).toEqual(roleResult);
      expect(auditLogService.log).toHaveBeenCalledWith('Create Role', mockActor, null, roleResult);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if role does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne('non-existent-uuid')).rejects.toThrow(NotFoundException);
    });

    it('should return role when found', async () => {
      const mockRole = {
        id: '1',
        name: 'Doctor',
        permissions: ['read'],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      repository.findById.mockResolvedValue(mockRole);

      expect(await service.findOne('1')).toEqual(mockRole);
    });
  });

  describe('remove', () => {
    it('should throw BadRequestException if role is assigned to active users', async () => {
      const mockRole = {
        id: '1',
        name: 'Doctor',
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      repository.findById.mockResolvedValue(mockRole);
      (prismaService.user.count as jest.Mock).mockResolvedValue(3);

      await expect(service.remove('1', mockActor)).rejects.toThrow(BadRequestException);
    });

    it('should soft delete and log audit if no active users are assigned', async () => {
      const mockRole = {
        id: '1',
        name: 'Doctor',
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      repository.findById.mockResolvedValue(mockRole);
      (prismaService.user.count as jest.Mock).mockResolvedValue(0);
      repository.softDelete.mockResolvedValue({ ...mockRole, deletedAt: new Date() });

      await service.remove('1', mockActor);

      expect(repository.softDelete).toHaveBeenCalledWith('1');
      expect(auditLogService.log).toHaveBeenCalled();
    });
  });
});
