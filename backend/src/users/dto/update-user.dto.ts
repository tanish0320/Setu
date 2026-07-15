import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'User email address', example: 'doctor@hospital.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'User full name', example: 'Dr. Jane Smith' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Active status of the user', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
