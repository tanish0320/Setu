import { Module } from '@nestjs/common';
import { AffiliationsService } from './affiliations.service';
import { AffiliationsController } from './affiliations.controller';
import { AffiliationsRepository } from './affiliations.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { DoctorsModule } from '../doctors/doctors.module';
import { HospitalsModule } from '../hospitals/hospitals.module';

@Module({
  imports: [
    PrismaModule,
    AuditLogModule,
    DoctorsModule,
    HospitalsModule,
  ],
  controllers: [AffiliationsController],
  providers: [AffiliationsService, AffiliationsRepository],
  exports: [AffiliationsService, AffiliationsRepository],
})
export class AffiliationsModule {}
