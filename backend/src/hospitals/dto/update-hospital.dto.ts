import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsObject } from 'class-validator';

export class UpdateHospitalDto {
  @ApiPropertyOptional({ description: 'Hospital name', example: 'Apollo Hospital' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ description: 'Hospital short name / abbreviation', example: 'APLO' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  shortName?: string;

  @ApiPropertyOptional({ description: 'Hospital physical address', example: '123 Main St, New Delhi' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'GPS Coordinate X (Latitude)', example: 28.6139 })
  @IsOptional()
  @IsNumber()
  x?: number;

  @ApiPropertyOptional({ description: 'GPS Coordinate Y (Longitude)', example: 77.2090 })
  @IsOptional()
  @IsNumber()
  y?: number;

  @ApiPropertyOptional({ description: 'Subscription status', example: 'active' })
  @IsOptional()
  @IsString()
  subscriptionStatus?: string;

  @ApiPropertyOptional({ description: 'JSON configuration settings', example: { emergencyRouting: true } })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}
