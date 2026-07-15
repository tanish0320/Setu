import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import { QueryRoleDto } from './dto/query-role.dto';

@Injectable()
export class RolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.RoleCreateInput): Promise<Role> {
    return this.prisma.role.create({ data });
  }

  async update(id: string, data: Prisma.RoleUpdateInput): Promise<Role> {
    return this.prisma.role.update({
      where: { id },
      data,
    });
  }

  async findById(id: string): Promise<Role | null> {
    return this.prisma.role.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findByName(name: string): Promise<Role | null> {
    return this.prisma.role.findFirst({
      where: { name, deletedAt: null },
    });
  }

  async findAll(query: QueryRoleDto): Promise<{ items: Role[]; total: number; page: number; limit: number }> {
    const { search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.RoleWhereInput = {
      deletedAt: null,
    };

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.role.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.role.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async softDelete(id: string): Promise<Role> {
    return this.prisma.role.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
