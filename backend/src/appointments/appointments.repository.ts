import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { QueryAppointmentDto } from './dto/query-appointment.dto';

@Injectable()
export class AppointmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AppointmentUncheckedCreateInput) {
    return this.prisma.appointment.create({
      data,
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        hospital: true,
      },
    });
  }

  async update(id: string, data: Prisma.AppointmentUncheckedUpdateInput) {
    return this.prisma.appointment.update({
      where: { id },
      data,
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        hospital: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.appointment.findFirst({
      where: { id, deletedAt: null },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        hospital: true,
      },
    });
  }

  async softDelete(id: string) {
    return this.prisma.appointment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async findAll(query: QueryAppointmentDto) {
    const {
      doctorId,
      hospitalId,
      status,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.AppointmentWhereInput = {
      deletedAt: null,
    };

    if (doctorId) {
      where.doctorId = doctorId;
    }

    if (hospitalId) {
      where.hospitalId = hospitalId;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.scheduledStart = {};
      if (startDate) {
        where.scheduledStart.gte = new Date(startDate);
      }
      if (endDate) {
        where.scheduledStart.lte = new Date(endDate);
      }
    }

    if (search) {
      where.OR = [
        { patientName: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
        { patientPhone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.AppointmentOrderByWithRelationInput = {};
    if (sortBy === 'doctorName') {
      orderBy.doctor = { user: { name: sortOrder } };
    } else if (sortBy === 'hospitalName') {
      orderBy.hospital = { name: sortOrder };
    } else {
      (orderBy as any)[sortBy] = sortOrder;
    }

    const [items, total] = await Promise.all([
      this.prisma.appointment.findMany({
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
        },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async findDoctorAppointmentsForDay(doctorId: string, startOfDay: Date, endOfDay: Date, excludeAppointmentId?: string) {
    const where: Prisma.AppointmentWhereInput = {
      doctorId,
      deletedAt: null,
      status: { not: 'Cancelled' }, // Exclude Cancelled appointments
      scheduledStart: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    if (excludeAppointmentId) {
      where.id = { not: excludeAppointmentId };
    }

    return this.prisma.appointment.findMany({
      where,
      orderBy: {
        scheduledStart: 'asc',
      },
      include: {
        hospital: true,
      },
    });
  }

  async findAffiliation(doctorId: string, hospitalId: string) {
    return this.prisma.doctorHospitalAffiliation.findFirst({
      where: {
        doctorId,
        hospitalId,
        isActive: true,
      },
    });
  }

  async findAvailabilityWindows(affiliationId: string, dayOfWeek: number) {
    return this.prisma.availabilityWindow.findMany({
      where: {
        affiliationId,
        dayOfWeek,
        isActive: true,
        deletedAt: null,
      },
    });
  }

  async createStatusHistory(data: Prisma.AppointmentStatusHistoryUncheckedCreateInput) {
    return this.prisma.appointmentStatusHistory.create({
      data,
    });
  }

  async findStatusHistory(appointmentId: string) {
    return this.prisma.appointmentStatusHistory.findMany({
      where: { appointmentId },
      orderBy: { timestamp: 'desc' },
    });
  }

  async findCalendarAppointments(params: {
    start: Date;
    end: Date;
    doctorId?: string;
    hospitalId?: string;
    status?: string;
  }) {
    const { start, end, doctorId, hospitalId, status } = params;
    const where: Prisma.AppointmentWhereInput = {
      deletedAt: null,
      scheduledStart: {
        gte: start,
        lte: end,
      },
    };

    if (doctorId) {
      where.doctorId = doctorId;
    }

    if (hospitalId) {
      where.hospitalId = hospitalId;
    }

    if (status) {
      where.status = status;
    }

    return this.prisma.appointment.findMany({
      where,
      orderBy: {
        scheduledStart: 'asc',
      },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        hospital: true,
      },
    });
  }

  async findNextAppointment(doctorId: string, afterTime: Date) {
    return this.prisma.appointment.findFirst({
      where: {
        doctorId,
        status: 'Confirmed',
        scheduledStart: {
          gt: afterTime,
        },
        deletedAt: null,
      },
      orderBy: {
        scheduledStart: 'asc',
      },
    });
  }

  async findDoctorById(id: string) {
    return this.prisma.doctor.findFirst({
      where: { id, deletedAt: null },
      include: {
        user: true,
      },
    });
  }
}
