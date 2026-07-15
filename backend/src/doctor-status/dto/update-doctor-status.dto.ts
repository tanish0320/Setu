import { IsEnum, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDoctorStatusDto {
  @ApiProperty({
    description: 'Manual status update for the doctor',
    enum: ['Available', 'On Break', 'Unavailable', 'Offline'],
  })
  @IsEnum(['Available', 'On Break', 'Unavailable', 'Offline'], {
    message: 'Status must be one of: Available, On Break, Unavailable, Offline',
  })
  status: string;

  @ApiPropertyOptional({
    description: 'Reason for the manual status change',
  })
  @IsString()
  @IsOptional()
  reason?: string;
}
