import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreateHospitalDto {
  @ApiProperty({ description: 'Hospital name', example: 'Apollo Hospital' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Hospital short name / abbreviation', example: 'APLO' })
  @IsString()
  @IsNotEmpty()
  shortName: string;

  @ApiPropertyOptional({ description: 'Hospital physical address', example: '123 Main St, New Delhi' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'GPS Coordinate X (Latitude)', example: 28.6139 })
  @IsNumber()
  x: number;

  @ApiProperty({ description: 'GPS Coordinate Y (Longitude)', example: 77.2090 })
  @IsNumber()
  y: number;

  @ApiPropertyOptional({ description: 'Subscription status', example: 'active', default: 'active' })
  @IsOptional()
  @IsString()
  subscriptionStatus?: string = 'active';

  @ApiPropertyOptional({ description: 'JSON configuration settings', example: { emergencyRouting: true } })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}
