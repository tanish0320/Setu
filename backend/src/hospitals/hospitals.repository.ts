import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Hospital } from '@prisma/client';
import { QueryHospitalDto } from './dto/query-hospital.dto';

@Injectable()
export class HospitalsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.HospitalCreateInput): Promise<Hospital> {
    return this.prisma.hospital.create({ data });
  }

  async update(id: string, data: Prisma.HospitalUpdateInput): Promise<Hospital> {
    return this.prisma.hospital.update({
      where: { id },
      data,
    });
  }

  async findById(id: string): Promise<Hospital | null> {
    return this.prisma.hospital.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findByIdAny(id: string): Promise<Hospital | null> {
    return this.prisma.hospital.findFirst({
      where: { id },
    });
  }

  async findAll(query: QueryHospitalDto) {
    const {
      search,
      subscriptionStatus,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.HospitalWhereInput = {
      deletedAt: null,
    };

    if (subscriptionStatus) {
      where.subscriptionStatus = subscriptionStatus;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { shortName: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.HospitalOrderByWithRelationInput = {};
    (orderBy as any)[sortBy] = sortOrder;

    const [items, total] = await Promise.all([
      this.prisma.hospital.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.hospital.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async softDelete(id: string): Promise<Hospital> {
    return this.prisma.hospital.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
