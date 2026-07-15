import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsRepository } from './appointments.repository';
import { AppointmentsService } from './appointments.service';
import { ConflictDetectionService } from './conflict-detection.service';
import { CalendarService } from './calendar.service';
import { SlotSuggestionService } from './slot-suggestion.service';
import { TravelService } from './travel/travel.service';
import { MockTravelProvider } from './travel/mock-travel.provider';
import { DoctorStatusModule } from '../doctor-status/doctor-status.module';

@Module({
  imports: [
    PrismaModule,
    AuditLogModule,
    forwardRef(() => DoctorStatusModule),
  ],
  controllers: [AppointmentsController],
  providers: [
    AppointmentsRepository,
    AppointmentsService,
    ConflictDetectionService,
    CalendarService,
    SlotSuggestionService,
    TravelService,
    {
      provide: 'TravelProvider',
      useClass: MockTravelProvider,
    },
  ],
  exports: [
    AppointmentsService,
    ConflictDetectionService,
    CalendarService,
    SlotSuggestionService,
    TravelService,
  ],
})
export class AppointmentsModule {}
