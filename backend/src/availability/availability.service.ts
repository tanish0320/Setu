import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AvailabilityRepository } from './availability.repository';
import { AffiliationsRepository } from '../affiliations/affiliations.repository';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { QueryAvailabilityDto } from './dto/query-availability.dto';
import { AuditLogService, AuditActor } from '../audit-log/audit-log.service';

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
    private readonly affiliationsRepository: AffiliationsRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  private timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private validateTimeRange(startTime: string, endTime: string) {
    const startMins = this.timeToMinutes(startTime);
    const endMins = this.timeToMinutes(endTime);
    if (startMins >= endMins) {
      throw new BadRequestException('startTime must be strictly before endTime');
    }
  }

  async create(createAvailabilityDto: CreateAvailabilityDto, actor: AuditActor) {
    const { affiliationId, startTime, endTime } = createAvailabilityDto;

    // Verify affiliation exists
    const affiliation = await this.affiliationsRepository.findById(affiliationId);
    if (!affiliation) {
      throw new NotFoundException(`Affiliation with ID "${affiliationId}" not found`);
    }

    // Verify time logic
    this.validateTimeRange(startTime, endTime);

    const window = await this.availabilityRepository.create(createAvailabilityDto);
    await this.auditLogService.log('Create Availability Window', actor, null, window);
    return window;
  }

  async findAll(query: QueryAvailabilityDto) {
    return this.availabilityRepository.findAll(query);
  }

  async findOne(id: string) {
    const window = await this.availabilityRepository.findById(id);
    if (!window) {
      throw new NotFoundException(`Availability Window with ID "${id}" not found`);
    }
    return window;
  }

  async update(id: string, updateAvailabilityDto: UpdateAvailabilityDto, actor: AuditActor) {
    const window = await this.availabilityRepository.findById(id);
    if (!window) {
      throw new NotFoundException(`Availability Window with ID "${id}" not found`);
    }

    const { affiliationId, startTime, endTime } = updateAvailabilityDto;

    if (affiliationId && affiliationId !== window.affiliationId) {
      const affiliation = await this.affiliationsRepository.findById(affiliationId);
      if (!affiliation) {
        throw new NotFoundException(`Affiliation with ID "${affiliationId}" not found`);
      }
    }

    const start = startTime || window.startTime;
    const end = endTime || window.endTime;
    this.validateTimeRange(start, end);

    const updated = await this.availabilityRepository.update(id, updateAvailabilityDto);
    await this.auditLogService.log('Update Availability Window', actor, window, updated);
    return updated;
  }

  async remove(id: string, actor: AuditActor) {
    const window = await this.availabilityRepository.findById(id);
    if (!window) {
      throw new NotFoundException(`Availability Window with ID "${id}" not found`);
    }

    const deleted = await this.availabilityRepository.softDelete(id);
    await this.auditLogService.log('Delete Availability Window', actor, window, deleted);
    return deleted;
  }
}
