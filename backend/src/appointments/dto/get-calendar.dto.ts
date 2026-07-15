import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString, IsIn } from 'class-validator';

export class GetCalendarDto {
  @ApiProperty({ description: 'View type: day, week, or month', enum: ['day', 'week', 'month'] })
  @IsString()
  @IsIn(['day', 'week', 'month'])
  view: 'day' | 'week' | 'month';

  @ApiPropertyOptional({ description: 'Reference date in YYYY-MM-DD format (defaults to current date)', example: '2026-07-15' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ description: 'Filter by doctor ID' })
  @IsOptional()
  @IsUUID()
  doctorId?: string;

  @ApiPropertyOptional({ description: 'Filter by hospital ID' })
  @IsOptional()
  @IsUUID()
  hospitalId?: string;

  @ApiPropertyOptional({ description: 'Filter by status (e.g. Confirmed)' })
  @IsOptional()
  @IsString()
  status?: string;
}
