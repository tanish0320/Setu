import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AuditActor {
  name: string;
  role: string;
  ip?: string;
  device?: string;
  hospital?: string;
}

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async log(
    action: string,
    actor: AuditActor,
    prevVal?: any,
    newVal?: any,
  ) {
    return this.prisma.auditLog.create({
      data: {
        action,
        actor: actor.name || 'system',
        role: actor.role || 'system',
        hospital: actor.hospital || null,
        prevVal: prevVal ? JSON.stringify(prevVal) : null,
        newVal: newVal ? JSON.stringify(newVal) : null,
        ip: actor.ip || null,
        device: actor.device || null,
      },
    });
  }
}
