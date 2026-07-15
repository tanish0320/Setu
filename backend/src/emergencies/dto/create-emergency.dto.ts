import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEmergencyDto {
  @ApiProperty({ description: 'ID of the hospital requesting emergency assistance', example: 'a0c10c10-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  hospitalId: string;

  @ApiProperty({ description: 'Specialty required for the emergency (e.g. Cardiology, Neurology)', example: 'Cardiology' })
  @IsString()
  @IsNotEmpty()
  specialty: string;

  @ApiProperty({ description: 'Urgency tier of the request (e.g. Critical, Urgent, Standard)', example: 'Critical' })
  @IsString()
  @IsNotEmpty()
  urgency: string;

  @ApiPropertyOptional({ description: 'Brief patient summary or clinical notes', example: 'Patient presenting with acute chest pain and ST-elevation' })
  @IsOptional()
  @IsString()
  patientSummary?: string;
}
