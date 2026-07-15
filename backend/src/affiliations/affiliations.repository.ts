import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, DoctorHospitalAffiliation } from '@prisma/client';
import { QueryAffiliationDto } from './dto/query-affiliation.dto';

@Injectable()
export class AffiliationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { doctorId: string; hospitalId: string; isPrimary?: boolean; isActive?: boolean; empanelmentDate?: Date | string; createdBy?: string }) {
    const { doctorId, hospitalId, ...rest } = data;
    return this.prisma.doctorHospitalAffiliation.create({
      data: {
        ...rest,
        doctor: { connect: { id: doctorId } },
        hospital: { connect: { id: hospitalId } },
      },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        hospital: true,
        availabilityWindows: true,
      },
    });
  }

  async update(id: string, data: { doctorId?: string; hospitalId?: string; isPrimary?: boolean; isActive?: boolean; empanelmentDate?: Date | string; createdBy?: string }) {
    const { doctorId, hospitalId, ...rest } = data;
    return this.prisma.doctorHospitalAffiliation.update({
      where: { id },
      data: {
        ...rest,
        doctor: doctorId ? { connect: { id: doctorId } } : undefined,
        hospital: hospitalId ? { connect: { id: hospitalId } } : undefined,
      },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        hospital: true,
        availabilityWindows: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.doctorHospitalAffiliation.findUnique({
      where: { id },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        hospital: true,
        availabilityWindows: true,
      },
    });
  }

  async findByDoctorAndHospital(doctorId: string, hospitalId: string) {
    return this.prisma.doctorHospitalAffiliation.findUnique({
      where: {
        doctorId_hospitalId: {
          doctorId,
          hospitalId,
        },
      },
      include: {
        doctor: true,
        hospital: true,
        availabilityWindows: true,
      },
    });
  }

  async findAll(query: QueryAffiliationDto) {
    const {
      doctorId,
      hospitalId,
      isActive,
      isPrimary,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.DoctorHospitalAffiliationWhereInput = {};

    if (doctorId) {
      where.doctorId = doctorId;
    }

    if (hospitalId) {
      where.hospitalId = hospitalId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (isPrimary !== undefined) {
      where.isPrimary = isPrimary;
    }

    const orderBy: Prisma.DoctorHospitalAffiliationOrderByWithRelationInput = {};
    if (sortBy === 'doctor') {
      orderBy.doctor = { user: { name: sortOrder } };
    } else if (sortBy === 'hospital') {
      orderBy.hospital = { name: sortOrder };
    } else {
      (orderBy as any)[sortBy] = sortOrder;
    }

    const [items, total] = await Promise.all([
      this.prisma.doctorHospitalAffiliation.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          doctor: {
            include: {
              user: true,
            },
          },
          hospital: true,
          availabilityWindows: true,
        },
      }),
      this.prisma.doctorHospitalAffiliation.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async delete(id: string) {
    return this.prisma.doctorHospitalAffiliation.delete({
      where: { id },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        hospital: true,
        availabilityWindows: true,
      },
    });
  }

  async clearOtherPrimaries(doctorId: string) {
    return this.prisma.doctorHospitalAffiliation.updateMany({
      where: { doctorId, isPrimary: true },
      data: { isPrimary: false },
    });
  }
}

