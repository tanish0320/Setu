import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsOptional } from 'class-validator';

export class PreviewConflictsDto {
  @ApiProperty({ description: 'ID of the doctor', example: 'd0c10c10-e89b-12d3-a456-426614174000' })
  @IsUUID()
  doctorId: string;

  @ApiProperty({ description: 'ID of the hospital', example: 'a0c10c10-e89b-12d3-a456-426614174000' })
  @IsUUID()
  hospitalId: string;

  @ApiProperty({ description: 'Proposed start date and time', example: '2026-07-15T09:00:00.000Z' })
  @IsDateString()
  scheduledStart: string;

  @ApiProperty({ description: 'Proposed end date and time', example: '2026-07-15T09:30:00.000Z' })
  @IsDateString()
  scheduledEnd: string;

  @ApiPropertyOptional({ description: 'Existing appointment ID to exclude from conflict checks', example: 'e0c10c10-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  excludeAppointmentId?: string;
}
