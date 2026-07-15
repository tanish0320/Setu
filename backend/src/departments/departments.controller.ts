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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { QueryDepartmentDto } from './dto/query-department.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuditActor } from '../audit-log/audit-log.service';

@ApiTags('Departments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  private getActor(user: any, req: any): AuditActor {
    return {
      name: user?.name,
      role: user?.role?.name,
      ip: req?.ip,
      device: req?.headers?.['user-agent'],
    };
  }

  @Post()
  @Permissions('departments:create')
  @ApiOperation({ summary: 'Create a new department' })
  @ApiResponse({ status: 201, description: 'Department created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.departmentsService.create(createDepartmentDto, this.getActor(user, req));
  }

  @Get()
  @Permissions('departments:read')
  @ApiOperation({ summary: 'Get list of departments (filtered, paginated, sorted)' })
  @ApiResponse({ status: 200, description: 'Return paginated list of departments.' })
  async findAll(@Query() query: QueryDepartmentDto) {
    return this.departmentsService.findAll(query);
  }

  @Get(':id')
  @Permissions('departments:read')
  @ApiOperation({ summary: 'Get department details by ID' })
  @ApiResponse({ status: 200, description: 'Department details.' })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  async findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(id);
  }

  @Put(':id')
  @Permissions('departments:update')
  @ApiOperation({ summary: 'Update department profile' })
  @ApiResponse({ status: 200, description: 'Department updated successfully.' })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.departmentsService.update(id, updateDepartmentDto, this.getActor(user, req));
  }

  @Delete(':id')
  @Permissions('departments:delete')
  @ApiOperation({ summary: 'Soft delete (archive) a department' })
  @ApiResponse({ status: 200, description: 'Department archived successfully.' })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.departmentsService.remove(id, this.getActor(user, req));
  }
}
