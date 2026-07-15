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
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { QueryDoctorDto } from './dto/query-doctor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuditActor } from '../audit-log/audit-log.service';

@ApiTags('Doctors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  private getActor(user: any, req: any): AuditActor {
    return {
      name: user?.name,
      role: user?.role?.name,
      ip: req?.ip,
      device: req?.headers?.['user-agent'],
    };
  }

  @Post()
  @Permissions('doctors:create')
  @ApiOperation({ summary: 'Create a new doctor profile' })
  @ApiResponse({ status: 201, description: 'Doctor profile created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(
    @Body() createDoctorDto: CreateDoctorDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.doctorsService.create(createDoctorDto, this.getActor(user, req));
  }

  @Get()
  @Permissions('doctors:read')
  @ApiOperation({ summary: 'Get list of doctors (filtered, paginated, sorted)' })
  @ApiResponse({ status: 200, description: 'Return paginated list of doctors.' })
  async findAll(@Query() query: QueryDoctorDto) {
    return this.doctorsService.findAll(query);
  }

  @Get(':id')
  @Permissions('doctors:read')
  @ApiOperation({ summary: 'Get doctor details by ID' })
  @ApiResponse({ status: 200, description: 'Doctor profile details.' })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  async findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Put(':id')
  @Permissions('doctors:update')
  @ApiOperation({ summary: 'Update doctor profile' })
  @ApiResponse({ status: 200, description: 'Doctor profile updated successfully.' })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.doctorsService.update(id, updateDoctorDto, this.getActor(user, req));
  }

  @Delete(':id')
  @Permissions('doctors:delete')
  @ApiOperation({ summary: 'Soft delete doctor profile' })
  @ApiResponse({ status: 200, description: 'Doctor profile deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.doctorsService.remove(id, this.getActor(user, req));
  }
}
