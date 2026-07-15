import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, Max, Matches, IsBoolean, IsOptional } from 'class-validator';

export class UpdateAvailabilityDto {
  @ApiPropertyOptional({ description: 'ID of the doctor-hospital affiliation', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  affiliationId?: string;

  @ApiPropertyOptional({ description: 'Day of the week (0 = Sunday, 6 = Saturday)', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek?: number;

  @ApiPropertyOptional({ description: 'Start time in HH:MM format (24-hour)', example: '09:00' })
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'startTime must be in HH:MM format (24-hour)' })
  startTime?: string;

  @ApiPropertyOptional({ description: 'End time in HH:MM format (24-hour)', example: '17:00' })
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'endTime must be in HH:MM format (24-hour)' })
  endTime?: string;

  @ApiPropertyOptional({ description: 'Is the availability window active?', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
