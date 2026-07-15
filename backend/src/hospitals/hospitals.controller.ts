import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { QueryHospitalDto } from './dto/query-hospital.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuditActor } from '../audit-log/audit-log.service';

@ApiTags('Hospitals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  private getActor(user: any, req: any): AuditActor {
    return {
      name: user?.name,
      role: user?.role?.name,
      ip: req?.ip,
      device: req?.headers?.['user-agent'],
    };
  }

  @Post()
  @Permissions('hospitals:create')
  @ApiOperation({ summary: 'Create a new hospital' })
  @ApiResponse({ status: 201, description: 'Hospital created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(
    @Body() createHospitalDto: CreateHospitalDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.hospitalsService.create(createHospitalDto, this.getActor(user, req));
  }

  @Get()
  @Permissions('hospitals:read')
  @ApiOperation({ summary: 'Get list of hospitals (filtered, paginated, sorted)' })
  @ApiResponse({ status: 200, description: 'Return paginated list of hospitals.' })
  async findAll(@Query() query: QueryHospitalDto) {
    return this.hospitalsService.findAll(query);
  }

  @Get(':id')
  @Permissions('hospitals:read')
  @ApiOperation({ summary: 'Get hospital details by ID' })
  @ApiResponse({ status: 200, description: 'Hospital details.' })
  @ApiResponse({ status: 404, description: 'Hospital not found.' })
  async findOne(@Param('id') id: string) {
    return this.hospitalsService.findOne(id);
  }

  @Put(':id')
  @Permissions('hospitals:update')
  @ApiOperation({ summary: 'Update hospital profile/settings/coordinates/subscription' })
  @ApiResponse({ status: 200, description: 'Hospital updated successfully.' })
  @ApiResponse({ status: 404, description: 'Hospital not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateHospitalDto: UpdateHospitalDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.hospitalsService.update(id, updateHospitalDto, this.getActor(user, req));
  }

  @Delete(':id')
  @Permissions('hospitals:delete')
  @ApiOperation({ summary: 'Soft delete (archive) a hospital' })
  @ApiResponse({ status: 200, description: 'Hospital archived successfully.' })
  @ApiResponse({ status: 404, description: 'Hospital not found.' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.hospitalsService.remove(id, this.getActor(user, req));
  }
}
