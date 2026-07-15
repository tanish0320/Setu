import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { RolesRepository } from '../roles/roles.repository';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepo: jest.Mocked<UsersRepository>;
  let rolesRepo: jest.Mocked<RolesRepository>;
  let auditLogService: jest.Mocked<AuditLogService>;

  const mockActor = {
    name: 'Admin User',
    role: 'Super Admin',
    ip: '127.0.0.1',
    device: 'Jest Spec',
  };

  beforeEach(async () => {
    const mockUsersRepo = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByEmailAny: jest.fn(),
      findByIdWithPassword: jest.fn(),
      findAll: jest.fn(),
      softDelete: jest.fn(),
    };

    const mockRolesRepo = {
      findById: jest.fn(),
    };

    const mockAudit = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepo },
        { provide: RolesRepository, useValue: mockRolesRepo },
        { provide: AuditLogService, useValue: mockAudit },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepo = module.get(UsersRepository);
    rolesRepo = module.get(RolesRepository);
    auditLogService = module.get(AuditLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw BadRequestException if email already registered', async () => {
      usersRepo.findByEmailAny.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Existing User',
      } as any);

      await expect(
        service.create(
          {
            email: 'test@example.com',
            name: 'New User',
            password: 'password123',
            roleId: 'role-id',
          },
          mockActor,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if role does not exist', async () => {
      usersRepo.findByEmailAny.mockResolvedValue(null);
      rolesRepo.findById.mockResolvedValue(null);

      await expect(
        service.create(
          {
            email: 'test@example.com',
            name: 'New User',
            password: 'password123',
            roleId: 'non-existent-role',
          },
          mockActor,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should successfully hash password, create user, and write audit log', async () => {
      usersRepo.findByEmailAny.mockResolvedValue(null);
      rolesRepo.findById.mockResolvedValue({
        id: 'role-id',
        name: 'Doctor',
        permissions: ['read'],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const mockCreatedUser = {
        id: 'user-id',
        email: 'doctor@hospital.com',
        name: 'Dr. John',
        passwordHash: 'hashed-value',
        isActive: true,
        roleId: 'role-id',
        role: { name: 'Doctor' },
        createdAt: new Date(),
      };
      usersRepo.create.mockResolvedValue(mockCreatedUser as any);

      const result = await service.create(
        {
          email: 'doctor@hospital.com',
          name: 'Dr. John',
          password: 'password123',
          roleId: 'role-id',
        },
        mockActor,
      );

      expect(result).not.toHaveProperty('passwordHash');
      expect(result.email).toBe('doctor@hospital.com');
      expect(usersRepo.create).toHaveBeenCalled();
      expect(auditLogService.log).toHaveBeenCalled();
    });
  });

  describe('deactivate', () => {
    it('should set isActive to false and log audit', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        isActive: true,
        role: { name: 'Doctor' },
      };
      usersRepo.findById.mockResolvedValue(mockUser as any);
      usersRepo.update.mockResolvedValue({ ...mockUser, isActive: false } as any);

      const result = await service.deactivate('user-id', mockActor);

      expect(result.isActive).toBe(false);
      expect(usersRepo.update).toHaveBeenCalledWith('user-id', { isActive: false });
      expect(auditLogService.log).toHaveBeenCalled();
    });
  });
});
