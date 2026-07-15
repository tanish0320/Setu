import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DoctorStatusService } from './doctor-status.service';
import { QueryDoctorStatusDto } from './dto/query-doctor-status.dto';
import { UpdateDoctorStatusDto } from './dto/update-doctor-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuditActor, AuditLogService } from '../audit-log/audit-log.service';

@ApiTags('Doctor Status')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('doctor-status')
export class DoctorStatusController {
  constructor(
    private readonly doctorStatusService: DoctorStatusService,
    private readonly auditLogService: AuditLogService,
  ) {}

  private getActor(user: any, req: any): AuditActor {
    return {
      name: user?.name || 'system',
      role: user?.role?.name || 'system',
      ip: req?.ip,
      device: req?.headers?.['user-agent'],
    };
  }

  @Get()
  @Permissions('doctor-status:read')
  @ApiOperation({ summary: 'Get list of doctor statuses (filtered, paginated, sorted) with masking' })
  @ApiResponse({ status: 200, description: 'Return paginated list of doctor statuses.' })
  async findAll(
    @Query() query: QueryDoctorStatusDto,
    @Req() req: any,
  ) {
    const headerHospitalId = req.headers['x-hospital-id'] as string;
    const hospitalId = query.hospitalId || headerHospitalId;
    return this.doctorStatusService.findAll(query, hospitalId);
  }

  @Get(':id')
  @Permissions('doctor-status:read')
  @ApiOperation({ summary: 'Get specific doctor status with masking by ID or Doctor ID' })
  @ApiResponse({ status: 200, description: 'Return doctor status.' })
  @ApiResponse({ status: 404, description: 'Doctor status not found.' })
  async findOne(
    @Param('id') id: string,
    @Query('hospitalId') queryHospitalId: string,
    @Req() req: any,
  ) {
    const headerHospitalId = req.headers['x-hospital-id'] as string;
    const hospitalId = queryHospitalId || headerHospitalId;
    
    // Support finding by both DoctorStatus ID and Doctor ID
    try {
      return await this.doctorStatusService.findOne(id, hospitalId);
    } catch (err) {
      const statusRow = await this.doctorStatusService.getOrCreateStatus(id).catch(() => null);
      if (statusRow) {
        return this.doctorStatusService.applyMasking(statusRow, hospitalId);
      }
      throw new NotFoundException(`Doctor status with ID or Doctor ID ${id} not found`);
    }
  }

  @Patch(':id')
  @Permissions('doctor-status:update')
  @ApiOperation({ summary: 'Manually update doctor status (Available, On Break, Unavailable, Offline)' })
  @ApiResponse({ status: 200, description: 'Doctor status updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid transition or status value.' })
  @ApiResponse({ status: 404, description: 'Doctor status not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDoctorStatusDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    let statusRow = await this.doctorStatusService.findOne(id).catch(() => null);
    if (!statusRow) {
      statusRow = await this.doctorStatusService.getOrCreateStatus(id).catch(() => null);
    }
    if (!statusRow) {
      throw new NotFoundException(`Doctor status or Doctor with ID ${id} not found`);
    }

    const prev = { ...statusRow };
    const doctorId = statusRow.doctorId;
    
    const updated = await this.doctorStatusService.updateStatusManual(
      doctorId,
      updateDto.status,
      updateDto.reason,
      user?.name || 'doctor',
    );

    // Audit Log mutable action
    await this.auditLogService.log(
      'doctor_status:manual_update',
      this.getActor(user, req),
      prev,
      updated,
    );

    return updated;
  }

  @Get(':id/history')
  @Permissions('doctor-status:read')
  @ApiOperation({ summary: 'Get doctor status change history' })
  @ApiResponse({ status: 200, description: 'Return list of status history records.' })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  async findHistory(@Param('id') id: string) {
    // Resolve doctorId first
    let doctorId = id;
    const statusRow = await this.doctorStatusService.findOne(id).catch(() => null);
    if (statusRow) {
      doctorId = statusRow.doctorId;
    }
    return this.doctorStatusService.findHistory(doctorId);
  }
}
