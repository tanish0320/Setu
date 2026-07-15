import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class GetSuggestionsDto {
  @ApiProperty({ description: 'ID of the doctor', example: 'd0c10c10-e89b-12d3-a456-426614174000' })
  @IsUUID()
  doctorId: string;

  @ApiProperty({ description: 'ID of the hospital', example: 'a0c10c10-e89b-12d3-a456-426614174000' })
  @IsUUID()
  hospitalId: string;

  @ApiProperty({ description: 'Duration of the appointment in minutes', example: 30 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({ description: 'Target date in YYYY-MM-DD format', example: '2026-07-15' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'targetDate must be in YYYY-MM-DD format' })
  targetDate: string;
}
