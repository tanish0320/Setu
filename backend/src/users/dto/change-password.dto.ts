import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'The current password', example: 'OldPassword123' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ description: 'The new password (min 6 characters)', example: 'NewSecurePassword123' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
