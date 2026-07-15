import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Department } from '@prisma/client';
import { QueryDepartmentDto } from './dto/query-department.dto';

@Injectable()
export class DepartmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; description?: string; status?: string; hospitalId: string; headId?: string }) {
    const { hospitalId, headId, ...rest } = data;
    return this.prisma.department.create({
      data: {
        ...rest,
        hospital: { connect: { id: hospitalId } },
        head: headId ? { connect: { id: headId } } : undefined,
      },
      include: {
        hospital: true,
        head: true,
      },
    });
  }

  async update(id: string, data: { name?: string; description?: string; status?: string; hospitalId?: string; headId?: string }) {
    const { hospitalId, headId, ...rest } = data;
    return this.prisma.department.update({
      where: { id },
      data: {
        ...rest,
        hospital: hospitalId ? { connect: { id: hospitalId } } : undefined,
        head: headId !== undefined ? (headId ? { connect: { id: headId } } : { disconnect: true }) : undefined,
      },
      include: {
        hospital: true,
        head: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.department.findFirst({
      where: { id, deletedAt: null },
      include: {
        hospital: true,
        head: true,
      },
    });
  }

  async findByNameAndHospital(name: string, hospitalId: string) {
    return this.prisma.department.findFirst({
      where: { name, hospitalId, deletedAt: null },
    });
  }

  async findAll(query: QueryDepartmentDto) {
    const {
      search,
      hospitalId,
      headId,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.DepartmentWhereInput = {
      deletedAt: null,
    };

    if (hospitalId) {
      where.hospitalId = hospitalId;
    }

    if (headId) {
      where.headId = headId;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.DepartmentOrderByWithRelationInput = {};
    if (sortBy === 'hospital') {
      orderBy.hospital = { name: sortOrder };
    } else if (sortBy === 'head') {
      orderBy.head = { user: { name: sortOrder } };
    } else {
      (orderBy as any)[sortBy] = sortOrder;
    }

    const [items, total] = await Promise.all([
      this.prisma.department.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          hospital: true,
          head: {
            include: {
              user: true,
            },
          },
        },
      }),
      this.prisma.department.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async softDelete(id: string) {
    return this.prisma.department.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      include: {
        hospital: true,
        head: true,
      },
    });
  }
}
