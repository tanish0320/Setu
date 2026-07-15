import { Injectable } from '@nestjs/common';
import { Coordinates, TravelProvider } from './travel-provider.interface';

@Injectable()
export class MockTravelProvider implements TravelProvider {
  async calculateTravelTime(origin: Coordinates, destination: Coordinates): Promise<number> {
    const dx = origin.x - destination.x;
    const dy = origin.y - destination.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // 2 minutes per coordinate unit
    const travelTimeMinutes = distance * 2;
    return travelTimeMinutes;
  }
}
