import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Doctor } from '@prisma/client';
import { QueryDoctorDto } from './dto/query-doctor.dto';

@Injectable()
export class DoctorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.DoctorUncheckedCreateInput) {
    return this.prisma.doctor.create({
      data,
      include: {
        user: true,
      },
    });
  }

  async update(id: string, data: Prisma.DoctorUncheckedUpdateInput) {
    return this.prisma.doctor.update({
      where: { id },
      data,
      include: {
        user: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.doctor.findFirst({
      where: { id, deletedAt: null },
      include: {
        user: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.doctor.findFirst({
      where: { userId, deletedAt: null },
      include: {
        user: true,
      },
    });
  }

  async findAll(query: QueryDoctorDto) {
    const {
      search,
      specialty,
      emergencyOptIn,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.DoctorWhereInput = {
      deletedAt: null,
    };

    if (specialty) {
      where.specialty = { contains: specialty, mode: 'insensitive' };
    }

    if (emergencyOptIn !== undefined) {
      where.emergencyOptIn = emergencyOptIn;
    }

    if (search) {
      where.OR = [
        { specialty: { contains: search, mode: 'insensitive' } },
        { subspecialty: { contains: search, mode: 'insensitive' } },
        { medicalCouncilRegistration: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const orderBy: Prisma.DoctorOrderByWithRelationInput = {};
    if (sortBy === 'name') {
      orderBy.user = { name: sortOrder };
    } else {
      (orderBy as any)[sortBy] = sortOrder;
    }

    const [items, total] = await Promise.all([
      this.prisma.doctor.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: true,
        },
      }),
      this.prisma.doctor.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async softDelete(id: string) {
    return this.prisma.doctor.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      include: {
        user: true,
      },
    });
  }
}
