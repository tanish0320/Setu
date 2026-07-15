import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { TravelProvider } from './travel-provider.interface';

@Injectable()
export class TravelService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('TravelProvider') private readonly travelProvider: TravelProvider,
  ) {}

  async getTravelTimeBetweenHospitals(
    originHospitalId: string,
    destinationHospitalId: string,
  ): Promise<number> {
    if (originHospitalId === destinationHospitalId) {
      return 0;
    }

    const [originHospital, destHospital] = await Promise.all([
      this.prisma.hospital.findUnique({ where: { id: originHospitalId } }),
      this.prisma.hospital.findUnique({ where: { id: destinationHospitalId } }),
    ]);

    if (!originHospital) {
      throw new NotFoundException(`Origin hospital with ID ${originHospitalId} not found`);
    }
    if (!destHospital) {
      throw new NotFoundException(`Destination hospital with ID ${destinationHospitalId} not found`);
    }

    return this.travelProvider.calculateTravelTime(
      { x: originHospital.x, y: originHospital.y },
      { x: destHospital.x, y: destHospital.y },
    );
  }
}
