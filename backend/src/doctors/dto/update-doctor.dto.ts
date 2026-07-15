import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsInt, IsBoolean, IsArray, IsObject, Min } from 'class-validator';

export class UpdateDoctorDto {
  @ApiPropertyOptional({ description: 'UUID of the corresponding User account', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: 'Medical council registration number', example: 'MCI-12345' })
  @IsOptional()
  @IsString()
  medicalCouncilRegistration?: string;

  @ApiPropertyOptional({ description: 'Primary specialty', example: 'Cardiology' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  specialty?: string;

  @ApiPropertyOptional({ description: 'Subspecialty', example: 'Interventional Cardiology' })
  @IsOptional()
  @IsString()
  subspecialty?: string;

  @ApiPropertyOptional({ description: 'Avatar URL', example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: 'Years of professional experience', example: 10 })
  @IsOptional()
  @IsInt()
  @Min(0)
  experience?: number;

  @ApiPropertyOptional({ description: 'Opt-in status for emergency callouts', example: true })
  @IsOptional()
  @IsBoolean()
  emergencyOptIn?: boolean;

  @ApiPropertyOptional({ description: 'Travel radius in kilometers', example: 15 })
  @IsOptional()
  @IsInt()
  @Min(0)
  travelRadius?: number;

  @ApiPropertyOptional({ description: 'Default consultation duration in minutes', example: 30 })
  @IsOptional()
  @IsInt()
  @Min(1)
  defaultConsultationDuration?: number;

  @ApiPropertyOptional({ description: 'Default buffer duration in minutes', example: 5 })
  @IsOptional()
  @IsInt()
  @Min(0)
  defaultBuffer?: number;

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
