import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDoctorStatusDto {
  @ApiProperty({ description: 'ID of the doctor' })
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({ description: 'Initial status of the doctor', default: 'Offline' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({ description: 'Current hospital ID' })
  @IsString()
  @IsOptional()
  currentHospitalId?: string;

  @ApiPropertyOptional({ description: 'Next hospital ID' })
  @IsString()
  @IsOptional()
  nextHospitalId?: string;

  @ApiPropertyOptional({ description: 'ETA in minutes' })
  @IsInt()
  @IsOptional()
  etaMinutes?: number;
}
