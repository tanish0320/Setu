import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmergencyDto } from './dto/create-emergency.dto';
import { QueryEmergencyDto } from './dto/query-emergency.dto';

@Injectable()
export class EmergenciesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createRequest(dto: CreateEmergencyDto, createdBy?: string) {
    return this.prisma.emergencyRequest.create({
      data: {
        hospitalId: dto.hospitalId,
        specialty: dto.specialty,
        urgency: dto.urgency,
        patientSummary: dto.patientSummary || null,
        status: 'Searching',
        createdBy: createdBy || 'system',
      },
      include: {
        hospital: true,
        assignments: true,
      },
    });
  }

  async findRequestById(id: string) {
    return this.prisma.emergencyRequest.findUnique({
      where: { id, deletedAt: null },
      include: {
        hospital: true,
        assignments: {
          include: {
            doctor: {
              include: {
                user: true,
              },
            },
          },
        },
        escalations: true,
        timeline: true,
        acceptedDoctor: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findDoctorByUserId(userId: string) {
    return this.prisma.doctor.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  async findHospitalById(id: string) {
    return this.prisma.hospital.findUnique({
      where: { id },
    });
  }

  async findDoctorsForRanking(specialty: string) {
    return this.prisma.doctor.findMany({
      where: {
        specialty: {
          equals: specialty,
          mode: 'insensitive',
        },
        emergencyOptIn: true,
        deletedAt: null,
        user: {
          isActive: true,
          deletedAt: null,
        },
      },
      include: {
        user: true,
        status: true,
        hospitals: {
          include: {
            hospital: true,
          },
        },
        appointments: {
          where: {
            status: 'In Progress',
            deletedAt: null,
          },
        },
        emergencyAssignments: {
          include: {
            emergencyRequest: true,
          },
        },
      },
    });
  }

  async listRequests(queryDto: QueryEmergencyDto) {
    const {
      hospitalId,
      specialty,
      urgency,
      status,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = queryDto;

    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (hospitalId) {
      where.hospitalId = hospitalId;
    }
    if (specialty) {
      where.specialty = { equals: specialty, mode: 'insensitive' };
    }
    if (urgency) {
      where.urgency = urgency;
    }
    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { specialty: { contains: search, mode: 'insensitive' } },
        { urgency: { contains: search, mode: 'insensitive' } },
        { patientSummary: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.emergencyRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          hospital: true,
          acceptedDoctor: {
            include: {
              user: true,
            },
          },
        },
      }),
      this.prisma.emergencyRequest.count({ where }),
    ]);

    return { items, total };
  }

  async updateRequestStatus(id: string, status: string) {
    return this.prisma.emergencyRequest.update({
      where: { id },
      data: { status },
    });
  }

  async acceptRequest(id: string, doctorId: string, responseMode: string, eta: number) {
    return this.prisma.emergencyRequest.update({
      where: { id },
      data: {
        status: responseMode === 'Physical Visit' ? 'Travelling' : 'Accepted',
        acceptedDoctorId: doctorId,
        responseMode,
        eta,
        acceptedAt: new Date(),
      },
    });
  }

  async completeRequest(id: string) {
    return this.prisma.emergencyRequest.update({
      where: { id },
      data: {
        status: 'Completed',
        completedAt: new Date(),
      },
    });
  }

  async cancelRequest(id: string) {
    return this.prisma.emergencyRequest.update({
      where: { id },
      data: {
        status: 'Cancelled',
        deletedAt: new Date(), // Soft delete if cancel triggers it, but let's just mark cancelled and deletedAt
      },
    });
  }

  async createAssignment(emergencyRequestId: string, doctorId: string, status: string) {
    return this.prisma.emergencyAssignment.create({
      data: {
        emergencyRequestId,
        doctorId,
        status,
        notifiedAt: new Date(),
      },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        emergencyRequest: true,
      },
    });
  }

  async updateAssignmentStatus(id: string, status: string, latencySeconds?: number) {
    return this.prisma.emergencyAssignment.update({
      where: { id },
      data: {
        status,
        respondedAt: new Date(),
        responseLatency: latencySeconds || null,
      },
    });
  }

  async findActiveAssignmentForDoctor(emergencyRequestId: string, doctorId: string) {
    return this.prisma.emergencyAssignment.findFirst({
      where: {
        emergencyRequestId,
        doctorId,
        status: 'Alerted',
      },
    });
  }

  async getAssignmentsForRequest(emergencyRequestId: string) {
    return this.prisma.emergencyAssignment.findMany({
      where: { emergencyRequestId },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findAlertedAssignments() {
    return this.prisma.emergencyAssignment.findMany({
      where: {
        status: 'Alerted',
        emergencyRequest: {
          status: 'Alerting',
          deletedAt: null,
        },
      },
      include: {
        emergencyRequest: {
          include: {
            hospital: true,
          },
        },
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async createEscalationLog(emergencyRequestId: string, action: string, details: string) {
    return this.prisma.emergencyEscalationLog.create({
      data: {
        emergencyRequestId,
        action,
        details,
      },
    });
  }

  async getEscalations(emergencyRequestId: string) {
    return this.prisma.emergencyEscalationLog.findMany({
      where: { emergencyRequestId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createTimelineEntry(emergencyRequestId: string, action: string, actor: string, details?: string) {
    return this.prisma.emergencyTimeline.create({
      data: {
        emergencyRequestId,
        action,
        actor,
        details: details || null,
      },
    });
  }

  async getTimeline(emergencyRequestId: string) {
    return this.prisma.emergencyTimeline.findMany({
      where: { emergencyRequestId },
      orderBy: { timestamp: 'asc' },
    });
  }

  async hasSmsLogSince(emergencyRequestId: string, timestamp: Date): Promise<boolean> {
    const count = await this.prisma.emergencyEscalationLog.count({
      where: {
        emergencyRequestId,
        action: 'SMS',
        createdAt: { gte: timestamp },
      },
    });
    return count > 0;
  }

  async hasVoiceLogSince(emergencyRequestId: string, timestamp: Date): Promise<boolean> {
    const count = await this.prisma.emergencyEscalationLog.count({
      where: {
        emergencyRequestId,
        action: 'Voice',
        createdAt: { gte: timestamp },
      },
    });
    return count > 0;
  }

  async getHospitalCoordinates(hospitalId: string) {
    const hosp = await this.prisma.hospital.findUnique({
      where: { id: hospitalId },
      select: { x: true, y: true },
    });
    return hosp;
  }
}
