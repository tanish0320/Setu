import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { DoctorStatusController } from './doctor-status.controller';
import { DoctorStatusRepository } from './doctor-status.repository';
import { DoctorStatusService } from './doctor-status.service';
import { DoctorStatusGateway } from './doctor-status.gateway';

@Module({
  imports: [
    PrismaModule,
    AuditLogModule,
    forwardRef(() => AppointmentsModule),
  ],
  controllers: [DoctorStatusController],
  providers: [
    DoctorStatusRepository,
    DoctorStatusService,
    DoctorStatusGateway,
  ],
  exports: [
    DoctorStatusService,
    DoctorStatusGateway,
  ],
})
export class DoctorStatusModule {}
