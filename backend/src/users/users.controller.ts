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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuditActor } from '../audit-log/audit-log.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private getActor(user: any, req: any): AuditActor {
    return {
      name: user?.name,
      role: user?.role?.name,
      ip: req?.ip,
      device: req?.headers?.['user-agent'],
    };
  }

  @Post()
  @Permissions('users:create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.usersService.create(createUserDto, this.getActor(user, req));
  }

  @Get()
  @Permissions('users:read')
  @ApiOperation({ summary: 'Get list of users (filtered, paginated, sorted)' })
  @ApiResponse({ status: 200, description: 'Return paginated list.' })
  async findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @Permissions('users:read')
  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiResponse({ status: 200, description: 'User details.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @Permissions('users:update')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.usersService.update(id, updateUserDto, this.getActor(user, req));
  }

  @Put(':id/deactivate')
  @Permissions('users:deactivate')
  @ApiOperation({ summary: 'Deactivate user account (isActive = false)' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async deactivate(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.usersService.deactivate(id, this.getActor(user, req));
  }

  @Put(':id/assign-role')
  @Permissions('users:assign-role')
  @ApiOperation({ summary: 'Assign a new role to user' })
  @ApiResponse({ status: 200, description: 'Role assigned successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid role.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async assignRole(
    @Param('id') id: string,
    @Body() assignRoleDto: AssignRoleDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.usersService.assignRole(id, assignRoleDto, this.getActor(user, req));
  }

  @Put(':id/change-password')
  @Permissions('users:change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @ApiResponse({ status: 400, description: 'Incorrect old password.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.usersService.changePassword(id, changePasswordDto, this.getActor(user, req));
  }

  @Delete(':id')
  @Permissions('users:delete')
  @ApiOperation({ summary: 'Soft delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.usersService.remove(id, this.getActor(user, req));
  }
}
