import { Injectable, Logger } from '@nestjs/common';

export interface VoiceProvider {
  sendVoiceCall(phoneNumber: string, content: string): Promise<boolean>;
}

@Injectable()
export class MockVoiceProvider implements VoiceProvider {
  private readonly logger = new Logger(MockVoiceProvider.name);

  async sendVoiceCall(phoneNumber: string, content: string): Promise<boolean> {
    this.logger.log(`[VOICE DISPATCH] Call To: ${phoneNumber} | Content: ${content}`);
    return true;
  }
}
