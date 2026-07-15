import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsNotEmpty, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'ID of the doctor', example: 'd0c10c10-e89b-12d3-a456-426614174000' })
  @IsUUID()
  doctorId: string;

  @ApiProperty({ description: 'ID of the hospital', example: 'a0c10c10-e89b-12d3-a456-426614174000' })
  @IsUUID()
  hospitalId: string;

  @ApiProperty({ description: 'Full name of the patient', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  patientName: string;

  @ApiPropertyOptional({ description: 'Phone number of the patient', example: '+1234567890' })
  @IsOptional()
  @IsString()
  patientPhone?: string;

  @ApiPropertyOptional({ description: 'Internal patient ID if registered', example: 'p123' })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiPropertyOptional({ description: 'Type of appointment (e.g., Consultation, Follow-up, Surgery)', example: 'Consultation' })
  @IsOptional()
  @IsString()
  appointmentType?: string;

  @ApiProperty({ description: 'Scheduled start date and time', example: '2026-07-15T09:00:00.000Z' })
  @IsDateString()
  scheduledStart: string;

  @ApiProperty({ description: 'Scheduled end date and time', example: '2026-07-15T09:30:00.000Z' })
  @IsDateString()
  scheduledEnd: string;

  @ApiPropertyOptional({ description: 'Additional clinical or scheduling notes', example: 'Patient requested morning slot' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Flag to bypass conflict validation if user has overrides', example: false, default: false })
  @IsOptional()
  @IsBoolean()
  conflictOverride?: boolean = false;

  @ApiPropertyOptional({ description: 'Reason for overriding conflicts if conflictOverride is true', example: 'Urgent emergency check' })
  @IsOptional()
  @IsString()
  overrideReason?: string;
}
