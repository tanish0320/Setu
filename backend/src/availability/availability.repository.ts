import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, AvailabilityWindow } from '@prisma/client';
import { QueryAvailabilityDto } from './dto/query-availability.dto';

@Injectable()
export class AvailabilityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { affiliationId: string; dayOfWeek: number; startTime: string; endTime: string; isActive?: boolean }) {
    const { affiliationId, ...rest } = data;
    return this.prisma.availabilityWindow.create({
      data: {
        ...rest,
        affiliation: { connect: { id: affiliationId } },
      },
      include: {
        affiliation: {
          include: {
            doctor: {
              include: {
                user: true,
              },
            },
            hospital: true,
          },
        },
      },
    });
  }

  async update(id: string, data: { affiliationId?: string; dayOfWeek?: number; startTime?: string; endTime?: string; isActive?: boolean }) {
    const { affiliationId, ...rest } = data;
    return this.prisma.availabilityWindow.update({
      where: { id },
      data: {
        ...rest,
        affiliation: affiliationId ? { connect: { id: affiliationId } } : undefined,
      },
      include: {
        affiliation: {
          include: {
            doctor: {
              include: {
                user: true,
              },
            },
            hospital: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.availabilityWindow.findFirst({
      where: { id, deletedAt: null },
      include: {
        affiliation: {
          include: {
            doctor: {
              include: {
                user: true,
              },
            },
            hospital: true,
          },
        },
      },
    });
  }

  async findAll(query: QueryAvailabilityDto) {
    const {
      affiliationId,
      dayOfWeek,
      isActive,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.AvailabilityWindowWhereInput = {
      deletedAt: null,
    };

    if (affiliationId) {
      where.affiliationId = affiliationId;
    }

    if (dayOfWeek !== undefined) {
      where.dayOfWeek = dayOfWeek;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const orderBy: Prisma.AvailabilityWindowOrderByWithRelationInput = {};
    (orderBy as any)[sortBy] = sortOrder;

    const [items, total] = await Promise.all([
      this.prisma.availabilityWindow.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          affiliation: {
            include: {
              doctor: {
                include: {
                  user: true,
                },
              },
              hospital: true,
            },
          },
        },
      }),
      this.prisma.availabilityWindow.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async softDelete(id: string) {
    return this.prisma.availabilityWindow.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      include: {
        affiliation: true,
      },
    });
  }
}
