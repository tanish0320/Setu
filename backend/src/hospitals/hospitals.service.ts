import { Injectable, NotFoundException } from '@nestjs/common';
import { HospitalsRepository } from './hospitals.repository';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { QueryHospitalDto } from './dto/query-hospital.dto';
import { AuditLogService, AuditActor } from '../audit-log/audit-log.service';

@Injectable()
export class HospitalsService {
  constructor(
    private readonly hospitalsRepository: HospitalsRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(createHospitalDto: CreateHospitalDto, actor: AuditActor) {
    const hospital = await this.hospitalsRepository.create(createHospitalDto);
    await this.auditLogService.log('Create Hospital', actor, null, hospital);
    return hospital;
  }

  async findAll(query: QueryHospitalDto) {
    return this.hospitalsRepository.findAll(query);
  }

  async findOne(id: string) {
    const hospital = await this.hospitalsRepository.findById(id);
    if (!hospital) {
      throw new NotFoundException(`Hospital with ID "${id}" not found`);
    }
    return hospital;
  }

  async update(id: string, updateHospitalDto: UpdateHospitalDto, actor: AuditActor) {
    const hospital = await this.hospitalsRepository.findById(id);
    if (!hospital) {
      throw new NotFoundException(`Hospital with ID "${id}" not found`);
    }

    const updated = await this.hospitalsRepository.update(id, updateHospitalDto);
    await this.auditLogService.log('Update Hospital', actor, hospital, updated);
    return updated;
  }

  async remove(id: string, actor: AuditActor) {
    const hospital = await this.hospitalsRepository.findById(id);
    if (!hospital) {
      throw new NotFoundException(`Hospital with ID "${id}" not found`);
    }

    const deleted = await this.hospitalsRepository.softDelete(id);
    await this.auditLogService.log('Archive Hospital', actor, hospital, deleted);
    return deleted;
  }
}
