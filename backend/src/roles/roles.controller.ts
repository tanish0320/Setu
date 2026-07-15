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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuditActor } from '../audit-log/audit-log.service';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  private getActor(user: any, req: any): AuditActor {
    return {
      name: user?.name,
      role: user?.role?.name,
      ip: req?.ip,
      device: req?.headers?.['user-agent'],
    };
  }

  @Post()
  @Permissions('roles:create')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.rolesService.create(createRoleDto, this.getActor(user, req));
  }

  @Get()
  @Permissions('roles:read')
  @ApiOperation({ summary: 'Get all roles (filtered, paginated)' })
  @ApiResponse({ status: 200, description: 'List of roles.' })
  async findAll(@Query() query: QueryRoleDto) {
    return this.rolesService.findAll(query);
  }

  @Get(':id')
  @Permissions('roles:read')
  @ApiOperation({ summary: 'Get role details by ID' })
  @ApiResponse({ status: 200, description: 'Role details.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Put(':id')
  @Permissions('roles:update')
  @ApiOperation({ summary: 'Update a role' })
  @ApiResponse({ status: 200, description: 'Role updated successfully.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.rolesService.update(id, updateRoleDto, this.getActor(user, req));
  }

  @Delete(':id')
  @Permissions('roles:delete')
  @ApiOperation({ summary: 'Soft delete a role' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Cannot delete assigned role.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.rolesService.remove(id, this.getActor(user, req));
  }
}
