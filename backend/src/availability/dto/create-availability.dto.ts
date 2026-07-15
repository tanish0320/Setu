import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, Max, Matches, IsBoolean, IsOptional } from 'class-validator';

export class CreateAvailabilityDto {
  @ApiProperty({ description: 'ID of the doctor-hospital affiliation', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  affiliationId: string;

  @ApiProperty({ description: 'Day of the week (0 = Sunday, 6 = Saturday)', example: 1 })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({ description: 'Start time in HH:MM format (24-hour)', example: '09:00' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'startTime must be in HH:MM format (24-hour)' })
  startTime: string;

  @ApiProperty({ description: 'End time in HH:MM format (24-hour)', example: '17:00' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'endTime must be in HH:MM format (24-hour)' })
  endTime: string;

  @ApiPropertyOptional({ description: 'Is the availability window active?', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
