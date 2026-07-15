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
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { QueryAvailabilityDto } from './dto/query-availability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuditActor } from '../audit-log/audit-log.service';

@ApiTags('Availability')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  private getActor(user: any, req: any): AuditActor {
    return {
      name: user?.name,
      role: user?.role?.name,
      ip: req?.ip,
      device: req?.headers?.['user-agent'],
    };
  }

  @Post()
  @Permissions('availability:create')
  @ApiOperation({ summary: 'Create a new doctor availability window' })
  @ApiResponse({ status: 201, description: 'Availability window created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(
    @Body() createAvailabilityDto: CreateAvailabilityDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.availabilityService.create(createAvailabilityDto, this.getActor(user, req));
  }

  @Get()
  @Permissions('availability:read')
  @ApiOperation({ summary: 'Get list of availability windows (filtered, paginated, sorted)' })
  @ApiResponse({ status: 200, description: 'Return paginated list of availability windows.' })
  async findAll(@Query() query: QueryAvailabilityDto) {
    return this.availabilityService.findAll(query);
  }

  @Get(':id')
  @Permissions('availability:read')
  @ApiOperation({ summary: 'Get availability window details by ID' })
  @ApiResponse({ status: 200, description: 'Availability window details.' })
  @ApiResponse({ status: 404, description: 'Availability window not found.' })
  async findOne(@Param('id') id: string) {
    return this.availabilityService.findOne(id);
  }

  @Put(':id')
  @Permissions('availability:update')
  @ApiOperation({ summary: 'Update availability window' })
  @ApiResponse({ status: 200, description: 'Availability window updated successfully.' })
  @ApiResponse({ status: 404, description: 'Availability window not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.availabilityService.update(id, updateAvailabilityDto, this.getActor(user, req));
  }

  @Delete(':id')
  @Permissions('availability:delete')
  @ApiOperation({ summary: 'Soft delete availability window' })
  @ApiResponse({ status: 200, description: 'Availability window deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Availability window not found.' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.availabilityService.remove(id, this.getActor(user, req));
  }
}
