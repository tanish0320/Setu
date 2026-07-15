import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength, IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'User email address', example: 'doctor@hospital.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User full name', example: 'Dr. Jane Smith' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'User password (min 6 characters)', example: 'SecureP@ss123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'UUID of the role assigned to the user', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  roleId: string;

  @ApiPropertyOptional({ description: 'Active status of the user', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
