import { Injectable, Logger } from '@nestjs/common';

export interface PushProvider {
  sendPush(recipientId: string, title: string, content: string): Promise<boolean>;
}

@Injectable()
export class MockPushProvider implements PushProvider {
  private readonly logger = new Logger(MockPushProvider.name);

  async sendPush(recipientId: string, title: string, content: string): Promise<boolean> {
    this.logger.log(`[PUSH DISPATCH] To: ${recipientId} | Title: ${title} | Content: ${content}`);
    return true;
  }
}
