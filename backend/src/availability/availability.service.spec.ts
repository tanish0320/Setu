import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityService } from './availability.service';
import { AvailabilityRepository } from './availability.repository';
import { AffiliationsRepository } from '../affiliations/affiliations.repository';
import { AuditLogService } from '../audit-log/audit-log.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AvailabilityService', () => {
  let service: AvailabilityService;
  let repository: jest.Mocked<AvailabilityRepository>;
  let affiliationsRepository: jest.Mocked<AffiliationsRepository>;
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

    const mockAffiliationsRepo = {
      findById: jest.fn(),
    };

    const mockAudit = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilityService,
        { provide: AvailabilityRepository, useValue: mockRepository },
        { provide: AffiliationsRepository, useValue: mockAffiliationsRepo },
        { provide: AuditLogService, useValue: mockAudit },
      ],
    }).compile();

    service = module.get<AvailabilityService>(AvailabilityService);
    repository = module.get(AvailabilityRepository);
    affiliationsRepository = module.get(AffiliationsRepository);
    auditLogService = module.get(AuditLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw NotFoundException if affiliation does not exist', async () => {
      affiliationsRepository.findById.mockResolvedValue(null);
      const dto = { affiliationId: 'aff-1', dayOfWeek: 1, startTime: '09:00', endTime: '17:00' };
      await expect(service.create(dto, mockActor)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if startTime is after or equal to endTime', async () => {
      affiliationsRepository.findById.mockResolvedValue({ id: 'aff-1' } as any);
      const dto = { affiliationId: 'aff-1', dayOfWeek: 1, startTime: '17:00', endTime: '09:00' };
      await expect(service.create(dto, mockActor)).rejects.toThrow(BadRequestException);
    });
  });
});
