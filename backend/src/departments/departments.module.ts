import { Module, forwardRef } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { DepartmentsRepository } from './departments.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { HospitalsModule } from '../hospitals/hospitals.module';
import { DoctorsModule } from '../doctors/doctors.module';

@Module({
  imports: [
    PrismaModule,
    AuditLogModule,
    HospitalsModule,
    forwardRef(() => DoctorsModule),
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, DepartmentsRepository],
  exports: [DepartmentsService, DepartmentsRepository],
})
export class DepartmentsModule {}
