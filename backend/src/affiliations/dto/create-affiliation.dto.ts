import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsBoolean, IsOptional, IsDateString, IsString } from 'class-validator';

export class CreateAffiliationDto {
  @ApiProperty({ description: 'ID of the doctor profile', example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsUUID()
  doctorId: string;

  @ApiProperty({ description: 'ID of the hospital profile', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  hospitalId: string;

  @ApiPropertyOptional({ description: 'Is this the primary affiliation for the doctor?', example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean = false;

  @ApiPropertyOptional({ description: 'Is the affiliation active?', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiPropertyOptional({ description: 'Date of empanelment', example: '2026-07-14T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  empanelmentDate?: string;
}
