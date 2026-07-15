import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DepartmentsRepository } from './departments.repository';
import { HospitalsRepository } from '../hospitals/hospitals.repository';
import { DoctorsRepository } from '../doctors/doctors.repository';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { QueryDepartmentDto } from './dto/query-department.dto';
import { AuditLogService, AuditActor } from '../audit-log/audit-log.service';

@Injectable()
export class DepartmentsService {
  constructor(
    private readonly departmentsRepository: DepartmentsRepository,
    private readonly hospitalsRepository: HospitalsRepository,
    private readonly doctorsRepository: DoctorsRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto, actor: AuditActor) {
    const { hospitalId, headId, name } = createDepartmentDto;

    // Verify hospital exists
    const hospital = await this.hospitalsRepository.findById(hospitalId);
    if (!hospital) {
      throw new NotFoundException(`Hospital with ID "${hospitalId}" not found`);
    }

    // Verify head doctor exists if provided
    if (headId) {
      const doctor = await this.doctorsRepository.findById(headId);
      if (!doctor) {
        throw new NotFoundException(`Doctor with ID "${headId}" not found`);
      }
    }

    // Check unique name per hospital
    const existing = await this.departmentsRepository.findByNameAndHospital(name, hospitalId);
    if (existing) {
      throw new BadRequestException(`Department with name "${name}" already exists in this hospital`);
    }

    const department = await this.departmentsRepository.create(createDepartmentDto);
    await this.auditLogService.log('Create Department', actor, null, department);
    return department;
  }

  async findAll(query: QueryDepartmentDto) {
    return this.departmentsRepository.findAll(query);
  }

  async findOne(id: string) {
    const department = await this.departmentsRepository.findById(id);
    if (!department) {
      throw new NotFoundException(`Department with ID "${id}" not found`);
    }
    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto, actor: AuditActor) {
    const department = await this.departmentsRepository.findById(id);
    if (!department) {
      throw new NotFoundException(`Department with ID "${id}" not found`);
    }

    const { hospitalId, headId, name } = updateDepartmentDto;

    // Verify hospital exists if updating
    if (hospitalId) {
      const hospital = await this.hospitalsRepository.findById(hospitalId);
      if (!hospital) {
        throw new NotFoundException(`Hospital with ID "${hospitalId}" not found`);
      }
    }

    // Verify head doctor exists if updating
    if (headId) {
      const doctor = await this.doctorsRepository.findById(headId);
      if (!doctor) {
        throw new NotFoundException(`Doctor with ID "${headId}" not found`);
      }
    }

    // Check unique name per hospital if updating name/hospital
    const targetName = name || department.name;
    const targetHospitalId = hospitalId || department.hospitalId;
    if (name || hospitalId) {
      const existing = await this.departmentsRepository.findByNameAndHospital(targetName, targetHospitalId);
      if (existing && existing.id !== id) {
        throw new BadRequestException(`Department with name "${targetName}" already exists in this hospital`);
      }
    }

    const updated = await this.departmentsRepository.update(id, updateDepartmentDto);
    await this.auditLogService.log('Update Department', actor, department, updated);
    return updated;
  }

  async remove(id: string, actor: AuditActor) {
    const department = await this.departmentsRepository.findById(id);
    if (!department) {
      throw new NotFoundException(`Department with ID "${id}" not found`);
    }

    const deleted = await this.departmentsRepository.softDelete(id);
    await this.auditLogService.log('Archive Department', actor, department, deleted);
    return deleted;
  }
}
