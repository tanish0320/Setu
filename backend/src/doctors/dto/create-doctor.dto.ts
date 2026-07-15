import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsInt, IsBoolean, IsArray, IsObject, Min } from 'class-validator';

export class CreateDoctorDto {
  @ApiProperty({ description: 'UUID of the corresponding User account', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ description: 'Medical council registration number', example: 'MCI-12345' })
  @IsOptional()
  @IsString()
  medicalCouncilRegistration?: string;

  @ApiProperty({ description: 'Primary specialty', example: 'Cardiology' })
  @IsString()
  @IsNotEmpty()
  specialty: string;

  @ApiPropertyOptional({ description: 'Subspecialty', example: 'Interventional Cardiology' })
  @IsOptional()
  @IsString()
  subspecialty?: string;

  @ApiPropertyOptional({ description: 'Avatar URL', example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: 'Years of professional experience', example: 10, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  experience?: number = 0;

  @ApiPropertyOptional({ description: 'Opt-in status for emergency callouts', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  emergencyOptIn?: boolean = true;

  @ApiPropertyOptional({ description: 'Travel radius in kilometers', example: 15, default: 15 })
  @IsOptional()
  @IsInt()
  @Min(0)
  travelRadius?: number = 15;

  @ApiPropertyOptional({ description: 'Default consultation duration in minutes', example: 30, default: 30 })
  @IsOptional()
  @IsInt()
  @Min(1)
  defaultConsultationDuration?: number = 30;

  @ApiPropertyOptional({ description: 'Default buffer duration in minutes', example: 5, default: 5 })
  @IsOptional()
  @IsInt()
  @Min(0)
  defaultBuffer?: number = 5;

  @ApiPropertyOptional({ description: 'Notification channel preferences', example: { email: true, sms: false } })
  @IsOptional()
  @IsObject()
  notificationPreferences?: Record<string, any>;

  @ApiPropertyOptional({ description: 'List of skills/procedures', example: ['Angioplasty', 'Echocardiogram'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}
