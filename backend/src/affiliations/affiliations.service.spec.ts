import { Test, TestingModule } from '@nestjs/testing';
import { AffiliationsService } from './affiliations.service';
import { AffiliationsRepository } from './affiliations.repository';
import { DoctorsRepository } from '../doctors/doctors.repository';
import { HospitalsRepository } from '../hospitals/hospitals.repository';
import { AuditLogService } from '../audit-log/audit-log.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AffiliationsService', () => {
  let service: AffiliationsService;
  let repository: jest.Mocked<AffiliationsRepository>;
  let doctorsRepository: jest.Mocked<DoctorsRepository>;
  let hospitalsRepository: jest.Mocked<HospitalsRepository>;
  let auditLogService: jest.Mocked<AuditLogService>;

  const mockActor = { name: 'Admin', role: 'Super Admin' };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByDoctorAndHospital: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      clearOtherPrimaries: jest.fn(),
    };

    const mockDoctorsRepo = {
      findById: jest.fn(),
    };

    const mockHospitalsRepo = {
      findById: jest.fn(),
    };

    const mockAudit = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AffiliationsService,
        { provide: AffiliationsRepository, useValue: mockRepository },
        { provide: DoctorsRepository, useValue: mockDoctorsRepo },
        { provide: HospitalsRepository, useValue: mockHospitalsRepo },
        { provide: AuditLogService, useValue: mockAudit },
      ],
    }).compile();

    service = module.get<AffiliationsService>(AffiliationsService);
    repository = module.get(AffiliationsRepository);
    doctorsRepository = module.get(DoctorsRepository);
    hospitalsRepository = module.get(HospitalsRepository);
    auditLogService = module.get(AuditLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw NotFoundException if doctor does not exist', async () => {
      doctorsRepository.findById.mockResolvedValue(null);
      const dto = { doctorId: 'doc-1', hospitalId: 'hosp-1' };
      await expect(service.create(dto, mockActor)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if hospital does not exist', async () => {
      doctorsRepository.findById.mockResolvedValue({ id: 'doc-1' } as any);
      hospitalsRepository.findById.mockResolvedValue(null);
      const dto = { doctorId: 'doc-1', hospitalId: 'hosp-1' };
      await expect(service.create(dto, mockActor)).rejects.toThrow(NotFoundException);
    });
  });
});
