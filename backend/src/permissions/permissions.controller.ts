import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { QueryPermissionsDto } from './dto/query-permissions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @Permissions('permissions:read')
  @ApiOperation({ summary: 'Get list of system permissions' })
  @ApiResponse({ status: 200, description: 'Return all permissions.' })
  async findAll(@Query() query: QueryPermissionsDto) {
    return this.permissionsService.findAll(query);
  }

  @Get(':id')
  @Permissions('permissions:read')
  @ApiOperation({ summary: 'Get permission details by ID' })
  @ApiResponse({ status: 200, description: 'Return permission details.' })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  async findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }
}
