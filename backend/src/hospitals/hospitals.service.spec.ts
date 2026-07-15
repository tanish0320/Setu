import { Test, TestingModule } from '@nestjs/testing';
import { HospitalsService } from './hospitals.service';
import { HospitalsRepository } from './hospitals.repository';
import { AuditLogService } from '../audit-log/audit-log.service';
import { NotFoundException } from '@nestjs/common';

describe('HospitalsService', () => {
  let service: HospitalsService;
  let repository: jest.Mocked<HospitalsRepository>;
  let auditLogService: jest.Mocked<AuditLogService>;

  const mockActor = { name: 'Admin', role: 'Super Admin' };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      softDelete: jest.fn(),
    };

    const mockAudit = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HospitalsService,
        { provide: HospitalsRepository, useValue: mockRepository },
        { provide: AuditLogService, useValue: mockAudit },
      ],
    }).compile();

    service = module.get<HospitalsService>(HospitalsService);
    repository = module.get(HospitalsRepository);
    auditLogService = module.get(AuditLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create hospital and log audit', async () => {
      const dto = { name: 'Apollo', shortName: 'APLO', x: 12.3, y: 45.6 };
      const created = { id: 'hosp-id', ...dto, subscriptionStatus: 'active', settings: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null };
      repository.create.mockResolvedValue(created);

      const result = await service.create(dto, mockActor);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(auditLogService.log).toHaveBeenCalledWith('Create Hospital', mockActor, null, created);
      expect(result).toEqual(created);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if hospital doesn\'t exist', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
    });

    it('should return hospital if it exists', async () => {
      const hospital = { id: 'id', name: 'Apollo', shortName: 'APLO', x: 12.3, y: 45.6, subscriptionStatus: 'active', settings: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null };
      repository.findById.mockResolvedValue(hospital);
      const result = await service.findOne('id');
      expect(result).toEqual(hospital);
    });
  });
});
