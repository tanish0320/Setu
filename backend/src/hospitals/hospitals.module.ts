import { Module } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { HospitalsController } from './hospitals.controller';
import { HospitalsRepository } from './hospitals.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [PrismaModule, AuditLogModule],
  controllers: [HospitalsController],
  providers: [HospitalsService, HospitalsRepository],
  exports: [HospitalsService, HospitalsRepository],
})
export class HospitalsModule {}
