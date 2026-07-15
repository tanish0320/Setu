import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, forwardRef } from '@nestjs/common';
import { DoctorStatusService } from './doctor-status.service';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DoctorStatusGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Track connected doctor sockets (presence)
  // doctorId -> socketId[]
  private doctorSockets = new Map<string, string[]>();
  // socketId -> doctorId
  private socketDoctors = new Map<string, string>();

  constructor(
    @Inject(forwardRef(() => DoctorStatusService))
    private readonly doctorStatusService: DoctorStatusService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    const doctorId = client.handshake.query.doctorId as string || client.handshake.auth.doctorId as string;
    if (doctorId) {
      this.socketDoctors.set(client.id, doctorId);
      const sockets = this.doctorSockets.get(doctorId) || [];
      sockets.push(client.id);
      this.doctorSockets.set(doctorId, sockets);
    }
  }

  async handleDisconnect(client: Socket) {
    const doctorId = this.socketDoctors.get(client.id);
    if (doctorId) {
      this.socketDoctors.delete(client.id);
      let sockets = this.doctorSockets.get(doctorId) || [];
      sockets = sockets.filter((id) => id !== client.id);
      if (sockets.length === 0) {
        this.doctorSockets.delete(doctorId);
        try {
          await this.doctorStatusService.handleDisconnect(doctorId);
        } catch (e) {
          // Ignore
        }
      } else {
        this.doctorSockets.set(doctorId, sockets);
      }
    }
  }

  @SubscribeMessage('joinHospital')
  async handleJoinHospital(
    @ConnectedSocket() client: Socket,
    @MessageBody() hospitalId: string,
  ) {
    if (hospitalId) {
      await client.join(`hospital:${hospitalId}`);
      return { success: true, room: `hospital:${hospitalId}` };
    }
    return { success: false, error: 'Hospital ID is required' };
  }

  async broadcastStatusChange(status: any) {
    const hospitals = await this.prisma.hospital.findMany({
      where: { deletedAt: null },
      select: { id: true },
    });

    for (const h of hospitals) {
      const masked = this.doctorStatusService.applyMasking(status, h.id);
      this.server.to(`hospital:${h.id}`).emit('doctor_status_changed', masked);
    }
  }

  async broadcastEtaUpdated(doctorId: string, nextHospitalId: string, etaMinutes: number) {
    if (nextHospitalId) {
      this.server.to(`hospital:${nextHospitalId}`).emit('eta_updated', {
        doctorId,
        nextHospitalId,
        etaMinutes,
      });
    }
  }

  async broadcastDoctorArrived(doctorId: string, hospitalId: string) {
    this.server.emit('doctor_arrived', {
      doctorId,
      hospitalId,
    });
  }

  async broadcastEmergencyAccepted(doctorId: string) {
    this.server.emit('emergency_accepted', {
      doctorId,
      status: 'Emergency Active',
    });
  }

  async broadcastEmergencyCompleted(doctorId: string, restoredStatus: string) {
    this.server.emit('emergency_completed', {
      doctorId,
      status: restoredStatus,
    });
  }
}
