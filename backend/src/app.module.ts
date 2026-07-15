import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { DepartmentsModule } from './departments/departments.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AffiliationsModule } from './affiliations/affiliations.module';
import { AvailabilityModule } from './availability/availability.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { EmergenciesModule } from './emergencies/emergencies.module';
import { DoctorStatusModule } from './doctor-status/doctor-status.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AuditLogModule,
    PermissionsModule,
    RolesModule,
    UsersModule,
    HospitalsModule,
    DepartmentsModule,
    DoctorsModule,
    AffiliationsModule,
    AvailabilityModule,
    AppointmentsModule,
    EmergenciesModule,
    DoctorStatusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

