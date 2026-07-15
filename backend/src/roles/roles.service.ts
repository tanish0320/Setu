import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { AuditLogService, AuditActor } from '../audit-log/audit-log.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly auditLogService: AuditLogService,
    private readonly prisma: PrismaService,
  ) {}

  async create(createRoleDto: CreateRoleDto, actor: AuditActor) {
    const existing = await this.rolesRepository.findByName(createRoleDto.name);
    if (existing) {
      throw new BadRequestException(`Role with name "${createRoleDto.name}" already exists`);
    }

    const role = await this.rolesRepository.create(createRoleDto);

    await this.auditLogService.log(
      'Create Role',
      actor,
      null,
      role,
    );

    return role;
  }

  async findAll(query: QueryRoleDto) {
    return this.rolesRepository.findAll(query);
  }

  async findOne(id: string) {
    const role = await this.rolesRepository.findById(id);
    if (!role) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, actor: AuditActor) {
    const role = await this.findOne(id);

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existing = await this.rolesRepository.findByName(updateRoleDto.name);
      if (existing) {
        throw new BadRequestException(`Role with name "${updateRoleDto.name}" already exists`);
      }
    }

    const updatedRole = await this.rolesRepository.update(id, updateRoleDto);

    await this.auditLogService.log(
      'Update Role',
      actor,
      role,
      updatedRole,
    );

    return updatedRole;
  }

  async remove(id: string, actor: AuditActor) {
    const role = await this.findOne(id);

    // Prevent deletion of roles assigned to active users
    const usersCount = await this.prisma.user.count({
      where: { roleId: id, deletedAt: null },
    });
    if (usersCount > 0) {
      throw new BadRequestException(`Cannot delete role "${role.name}" as it is currently assigned to active users`);
    }

    const deletedRole = await this.rolesRepository.softDelete(id);

    await this.auditLogService.log(
      'Delete Role',
      actor,
      role,
      deletedRole,
    );

    return deletedRole;
  }
}
