import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsDateString, IsBoolean, IsIn } from 'class-validator';

export class UpdateAppointmentDto {
  @ApiPropertyOptional({ description: 'ID of the doctor', example: 'd0c10c10-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  doctorId?: string;

  @ApiPropertyOptional({ description: 'ID of the hospital', example: 'a0c10c10-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  hospitalId?: string;

  @ApiPropertyOptional({ description: 'Full name of the patient', example: 'John Doe' })
  @IsOptional()
  @IsString()
  patientName?: string;

  @ApiPropertyOptional({ description: 'Phone number of the patient', example: '+1234567890' })
  @IsOptional()
  @IsString()
  patientPhone?: string;

  @ApiPropertyOptional({ description: 'Internal patient ID if registered', example: 'p123' })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiPropertyOptional({ description: 'Type of appointment', example: 'Consultation' })
  @IsOptional()
  @IsString()
  appointmentType?: string;

  @ApiPropertyOptional({ description: 'Scheduled start date and time', example: '2026-07-15T09:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  scheduledStart?: string;

  @ApiPropertyOptional({ description: 'Scheduled end date and time', example: '2026-07-15T09:30:00.000Z' })
  @IsOptional()
  @IsDateString()
  scheduledEnd?: string;

  @ApiPropertyOptional({ description: 'Additional clinical or scheduling notes', example: 'Patient requested morning slot' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Flag to bypass conflict validation if user has overrides', example: false, default: false })
  @IsOptional()
  @IsBoolean()
  conflictOverride?: boolean;

  @ApiPropertyOptional({ description: 'Reason for overriding conflicts if conflictOverride is true', example: 'Urgent emergency check' })
  @IsOptional()
  @IsString()
  overrideReason?: string;

  @ApiPropertyOptional({
    description: 'Status of the appointment',
    example: 'Confirmed',
    enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'])
  status?: string;
}
