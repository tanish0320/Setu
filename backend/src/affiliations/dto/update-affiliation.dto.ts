import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class UpdateAffiliationDto {
  @ApiPropertyOptional({ description: 'ID of the doctor profile', example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsOptional()
  @IsUUID()
  doctorId?: string;

  @ApiPropertyOptional({ description: 'ID of the hospital profile', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  hospitalId?: string;

  @ApiPropertyOptional({ description: 'Is this the primary affiliation for the doctor?', example: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({ description: 'Is the affiliation active?', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Date of empanelment', example: '2026-07-14T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  empanelmentDate?: string;
}
