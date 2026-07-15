import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AffiliationsRepository } from './affiliations.repository';
import { DoctorsRepository } from '../doctors/doctors.repository';
import { HospitalsRepository } from '../hospitals/hospitals.repository';
import { CreateAffiliationDto } from './dto/create-affiliation.dto';
import { UpdateAffiliationDto } from './dto/update-affiliation.dto';
import { QueryAffiliationDto } from './dto/query-affiliation.dto';
import { AuditLogService, AuditActor } from '../audit-log/audit-log.service';

@Injectable()
export class AffiliationsService {
  constructor(
    private readonly affiliationsRepository: AffiliationsRepository,
    private readonly doctorsRepository: DoctorsRepository,
    private readonly hospitalsRepository: HospitalsRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(createAffiliationDto: CreateAffiliationDto, actor: AuditActor) {
    const { doctorId, hospitalId, isPrimary, isActive, empanelmentDate } = createAffiliationDto;

    // Verify doctor exists
    const doctor = await this.doctorsRepository.findById(doctorId);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID "${doctorId}" not found`);
    }

    // Verify hospital exists
    const hospital = await this.hospitalsRepository.findById(hospitalId);
    if (!hospital) {
      throw new NotFoundException(`Hospital with ID "${hospitalId}" not found`);
    }

    // Check if affiliation already exists
    const existing = await this.affiliationsRepository.findByDoctorAndHospital(doctorId, hospitalId);
    if (existing) {
      throw new BadRequestException(`Affiliation between doctor "${doctorId}" and hospital "${hospitalId}" already exists`);
    }

    if (isPrimary) {
      await this.affiliationsRepository.clearOtherPrimaries(doctorId);
    }

    const affiliation = await this.affiliationsRepository.create({
      doctorId,
      hospitalId,
      isPrimary,
      isActive,
      empanelmentDate: empanelmentDate ? new Date(empanelmentDate) : undefined,
      createdBy: actor.name || 'system',
    });

    await this.auditLogService.log('Create Affiliation', actor, null, affiliation);
    return affiliation;
  }

  async findAll(query: QueryAffiliationDto) {
    return this.affiliationsRepository.findAll(query);
  }

  async findOne(id: string) {
    const affiliation = await this.affiliationsRepository.findById(id);
    if (!affiliation) {
      throw new NotFoundException(`Affiliation with ID "${id}" not found`);
    }
    return affiliation;
  }

  async update(id: string, updateAffiliationDto: UpdateAffiliationDto, actor: AuditActor) {
    const affiliation = await this.affiliationsRepository.findById(id);
    if (!affiliation) {
      throw new NotFoundException(`Affiliation with ID "${id}" not found`);
    }

    const { doctorId, hospitalId, isPrimary } = updateAffiliationDto;
    const targetDoctorId = doctorId || affiliation.doctorId;
    const targetHospitalId = hospitalId || affiliation.hospitalId;

    // Validate relationships if doctor or hospital are updated
    if (doctorId && doctorId !== affiliation.doctorId) {
      const doctor = await this.doctorsRepository.findById(doctorId);
      if (!doctor) {
        throw new NotFoundException(`Doctor with ID "${doctorId}" not found`);
      }
    }
    if (hospitalId && hospitalId !== affiliation.hospitalId) {
      const hospital = await this.hospitalsRepository.findById(hospitalId);
      if (!hospital) {
        throw new NotFoundException(`Hospital with ID "${hospitalId}" not found`);
      }
    }

    // Check unique constraint if changing doctor/hospital
    if (doctorId || hospitalId) {
      const existing = await this.affiliationsRepository.findByDoctorAndHospital(targetDoctorId, targetHospitalId);
      if (existing && existing.id !== id) {
        throw new BadRequestException(`Affiliation between doctor "${targetDoctorId}" and hospital "${targetHospitalId}" already exists`);
      }
    }

    if (isPrimary) {
      await this.affiliationsRepository.clearOtherPrimaries(targetDoctorId);
    }

    const updated = await this.affiliationsRepository.update(id, {
      ...updateAffiliationDto,
      empanelmentDate: updateAffiliationDto.empanelmentDate ? new Date(updateAffiliationDto.empanelmentDate) : undefined,
    });

    await this.auditLogService.log('Update Affiliation', actor, affiliation, updated);
    return updated;
  }

  async remove(id: string, actor: AuditActor) {
    const affiliation = await this.affiliationsRepository.findById(id);
    if (!affiliation) {
      throw new NotFoundException(`Affiliation with ID "${id}" not found`);
    }

    const deleted = await this.affiliationsRepository.delete(id);
    await this.auditLogService.log('Delete Affiliation', actor, affiliation, deleted);
    return deleted;
  }
}
