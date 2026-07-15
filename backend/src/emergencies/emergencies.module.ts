import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { EmergenciesRepository } from './emergencies.repository';
import { RankingService } from './ranking.service';
import { EscalationService } from './escalation.service';
import { EmergenciesService } from './emergencies.service';
import { EmergenciesController } from './emergencies.controller';
import { MockPushProvider } from './providers/push.provider';
import { MockSmsProvider } from './providers/sms.provider';
import { MockVoiceProvider } from './providers/voice.provider';
import { DoctorStatusModule } from '../doctor-status/doctor-status.module';

@Module({
  imports: [PrismaModule, AuditLogModule, DoctorStatusModule],
  controllers: [EmergenciesController],
  providers: [
    EmergenciesRepository,
    RankingService,
    EscalationService,
    EmergenciesService,
    {
      provide: 'PushProvider',
      useClass: MockPushProvider,
    },
    {
      provide: 'SmsProvider',
      useClass: MockSmsProvider,
    },
    {
      provide: 'VoiceProvider',
      useClass: MockVoiceProvider,
    },
  ],
  exports: [
    EmergenciesService,
    EscalationService,
    RankingService,
    EmergenciesRepository,
  ],
})
export class EmergenciesModule {}
