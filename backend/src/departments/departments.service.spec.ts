import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsService } from './departments.service';
import { DepartmentsRepository } from './departments.repository';
import { HospitalsRepository } from '../hospitals/hospitals.repository';
import { DoctorsRepository } from '../doctors/doctors.repository';
import { AuditLogService } from '../audit-log/audit-log.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('DepartmentsService', () => {
  let service: DepartmentsService;
  let repository: jest.Mocked<DepartmentsRepository>;
  let hospitalsRepository: jest.Mocked<HospitalsRepository>;
  let doctorsRepository: jest.Mocked<DoctorsRepository>;
  let auditLogService: jest.Mocked<AuditLogService>;

  const mockActor = { name: 'Admin', role: 'Super Admin' };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByNameAndHospital: jest.fn(),
      findAll: jest.fn(),
      softDelete: jest.fn(),
    };

    const mockHospitalsRepo = {
      findById: jest.fn(),
    };

    const mockDoctorsRepo = {
      findById: jest.fn(),
    };

    const mockAudit = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentsService,
        { provide: DepartmentsRepository, useValue: mockRepository },
        { provide: HospitalsRepository, useValue: mockHospitalsRepo },
        { provide: DoctorsRepository, useValue: mockDoctorsRepo },
        { provide: AuditLogService, useValue: mockAudit },
      ],
    }).compile();

    service = module.get<DepartmentsService>(DepartmentsService);
    repository = module.get(DepartmentsRepository);
    hospitalsRepository = module.get(HospitalsRepository);
    doctorsRepository = module.get(DoctorsRepository);
    auditLogService = module.get(AuditLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw NotFoundException if hospital does not exist', async () => {
      hospitalsRepository.findById.mockResolvedValue(null);
      const dto = { name: 'Cardiology', hospitalId: 'hosp-1' };
      await expect(service.create(dto, mockActor)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if department already exists in hospital', async () => {
      hospitalsRepository.findById.mockResolvedValue({ id: 'hosp-1' } as any);
      repository.findByNameAndHospital.mockResolvedValue({ id: 'dept-1' } as any);
      const dto = { name: 'Cardiology', hospitalId: 'hosp-1' };
      await expect(service.create(dto, mockActor)).rejects.toThrow(BadRequestException);
    });
  });
});
