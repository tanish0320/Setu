import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { RolesRepository } from '../roles/roles.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { AuditLogService, AuditActor } from '../audit-log/audit-log.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  private sanitize(user: any) {
    if (!user) return null;
    const sanitized = { ...user };
    delete sanitized.passwordHash;
    delete sanitized.mfaSecret;
    return sanitized;
  }

  async create(createUserDto: CreateUserDto, actor: AuditActor) {
    const { email, password, roleId, name, isActive } = createUserDto;

    // Check if email already registered (active or soft-deleted)
    const existing = await this.usersRepository.findByEmailAny(email);
    if (existing) {
      throw new BadRequestException(`Email "${email}" is already registered`);
    }

    // Verify role exists
    const role = await this.rolesRepository.findById(roleId);
    if (!role) {
      throw new BadRequestException(`Role with ID "${roleId}" does not exist`);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await this.usersRepository.create({
      email,
      passwordHash,
      name,
      isActive: isActive !== undefined ? isActive : true,
      role: {
        connect: { id: roleId },
      },
    });

    const sanitized = this.sanitize(user);
    await this.auditLogService.log('Create User', actor, null, sanitized);
    return sanitized;
  }

  async findAll(query: QueryUserDto) {
    const result = await this.usersRepository.findAll(query);
    return {
      ...result,
      items: result.items.map((user) => this.sanitize(user)),
    };
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return this.sanitize(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto, actor: AuditActor) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.usersRepository.findByEmailAny(updateUserDto.email);
      if (existing) {
        throw new BadRequestException(`Email "${updateUserDto.email}" is already registered`);
      }
    }

    const updatedUser = await this.usersRepository.update(id, updateUserDto);
    const prevSanitized = this.sanitize(user);
    const nextSanitized = this.sanitize(updatedUser);

    await this.auditLogService.log('Update User', actor, prevSanitized, nextSanitized);
    return nextSanitized;
  }

  async deactivate(id: string, actor: AuditActor) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    const updatedUser = await this.usersRepository.update(id, { isActive: false });
    const prevSanitized = this.sanitize(user);
    const nextSanitized = this.sanitize(updatedUser);

    await this.auditLogService.log('Deactivate User', actor, prevSanitized, nextSanitized);
    return nextSanitized;
  }

  async assignRole(id: string, assignRoleDto: AssignRoleDto, actor: AuditActor) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    const role = await this.rolesRepository.findById(assignRoleDto.roleId);
    if (!role) {
      throw new BadRequestException(`Role with ID "${assignRoleDto.roleId}" does not exist`);
    }

    const updatedUser = await this.usersRepository.update(id, {
      role: { connect: { id: assignRoleDto.roleId } },
    });
    const prevSanitized = this.sanitize(user);
    const nextSanitized = this.sanitize(updatedUser);

    await this.auditLogService.log('Assign Role', actor, prevSanitized, nextSanitized);
    return nextSanitized;
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto, actor: AuditActor) {
    const user = await this.usersRepository.findByIdWithPassword(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    const isMatch = await bcrypt.compare(changePasswordDto.oldPassword, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Incorrect old password');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(changePasswordDto.newPassword, salt);

    await this.usersRepository.update(id, { passwordHash });

    await this.auditLogService.log('Change Password', actor, null, { userId: id });
    return { message: 'Password updated successfully' };
  }

  async remove(id: string, actor: AuditActor) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    const deletedUser = await this.usersRepository.softDelete(id);
    const prevSanitized = this.sanitize(user);
    const nextSanitized = this.sanitize(deletedUser);

    await this.auditLogService.log('Delete User', actor, prevSanitized, nextSanitized);
    return nextSanitized;
  }
}
