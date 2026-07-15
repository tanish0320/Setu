import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DoctorsRepository } from './doctors.repository';
import { UsersRepository } from '../users/users.repository';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { QueryDoctorDto } from './dto/query-doctor.dto';
import { AuditLogService, AuditActor } from '../audit-log/audit-log.service';

@Injectable()
export class DoctorsService {
  constructor(
    private readonly doctorsRepository: DoctorsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(createDoctorDto: CreateDoctorDto, actor: AuditActor) {
    const { userId } = createDoctorDto;

    // Verify user exists
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    // Verify user does not already have a doctor profile
    const existing = await this.doctorsRepository.findByUserId(userId);
    if (existing) {
      throw new BadRequestException(`Doctor profile for user ID "${userId}" already exists`);
    }

    const doctor = await this.doctorsRepository.create(createDoctorDto);
    await this.auditLogService.log('Create Doctor Profile', actor, null, doctor);
    return doctor;
  }

  async findAll(query: QueryDoctorDto) {
    return this.doctorsRepository.findAll(query);
  }

  async findOne(id: string) {
    const doctor = await this.doctorsRepository.findById(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID "${id}" not found`);
    }
    return doctor;
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto, actor: AuditActor) {
    const doctor = await this.doctorsRepository.findById(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID "${id}" not found`);
    }

    const { userId } = updateDoctorDto;
    if (userId && userId !== doctor.userId) {
      // Verify new user exists
      const user = await this.usersRepository.findById(userId);
      if (!user) {
        throw new NotFoundException(`User with ID "${userId}" not found`);
      }
      // Verify new user does not have a profile
      const existing = await this.doctorsRepository.findByUserId(userId);
      if (existing && existing.id !== id) {
        throw new BadRequestException(`Doctor profile for user ID "${userId}" already exists`);
      }
    }

    const updated = await this.doctorsRepository.update(id, updateDoctorDto);
    await this.auditLogService.log('Update Doctor Profile', actor, doctor, updated);
    return updated;
  }

  async remove(id: string, actor: AuditActor) {
    const doctor = await this.doctorsRepository.findById(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID "${id}" not found`);
    }

    const deleted = await this.doctorsRepository.softDelete(id);
    await this.auditLogService.log('Delete Doctor Profile', actor, doctor, deleted);
    return deleted;
  }
}
