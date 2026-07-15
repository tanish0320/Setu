import { Injectable, Logger } from '@nestjs/common';

export interface SmsProvider {
  sendSms(phoneNumber: string, content: string): Promise<boolean>;
}

@Injectable()
export class MockSmsProvider implements SmsProvider {
  private readonly logger = new Logger(MockSmsProvider.name);

  async sendSms(phoneNumber: string, content: string): Promise<boolean> {
    this.logger.log(`[SMS DISPATCH] To: ${phoneNumber} | Content: ${content}`);
    return true;
  }
}
