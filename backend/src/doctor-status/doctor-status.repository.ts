import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { QueryDoctorStatusDto } from './dto/query-doctor-status.dto';

@Injectable()
export class DoctorStatusRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByDoctorId(doctorId: string) {
    return this.prisma.doctorStatus.findUnique({
      where: { doctorId },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.doctorStatus.findUnique({
      where: { id },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async upsert(
    doctorId: string,
    data: Prisma.DoctorStatusUncheckedUpdateInput,
    defaultData: Prisma.DoctorStatusUncheckedCreateInput,
  ) {
    return this.prisma.doctorStatus.upsert({
      where: { doctorId },
      update: data,
      create: defaultData,
      include: {
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll(query: QueryDoctorStatusDto) {
    const {
      hospitalId,
      status,
      search,
      page = 1,
      limit = 10,
      sortBy = 'updatedAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.DoctorStatusWhereInput = {
      doctor: {
        deletedAt: null,
      },
    };

    if (status) {
      where.status = status;
    }

    if (hospitalId) {
      where.OR = [
        { currentHospitalId: hospitalId },
        { nextHospitalId: hospitalId },
        {
          doctor: {
            hospitals: {
              some: {
                hospitalId,
                isActive: true,
              },
            },
          },
        },
      ];
    }

    if (search) {
      where.doctor = {
        deletedAt: null,
        user: {
          name: { contains: search, mode: 'insensitive' },
        },
      };
    }

    const orderBy: Prisma.DoctorStatusOrderByWithRelationInput = {};
    if (sortBy === 'doctorName') {
      orderBy.doctor = { user: { name: sortOrder } };
    } else {
      (orderBy as any)[sortBy] = sortOrder;
    }

    const [items, total] = await Promise.all([
      this.prisma.doctorStatus.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          doctor: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.doctorStatus.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async createHistory(data: Prisma.DoctorStatusHistoryUncheckedCreateInput) {
    return this.prisma.doctorStatusHistory.create({
      data,
    });
  }

  async findHistoryByDoctorId(doctorId: string) {
    return this.prisma.doctorStatusHistory.findMany({
      where: { doctorId },
      orderBy: { changedAt: 'desc' },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async createStatusEvent(data: Prisma.StatusEventUncheckedCreateInput) {
    return this.prisma.statusEvent.create({
      data,
    });
  }
}
