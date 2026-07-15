import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'priya.patel@apollo.in', description: 'Registered email address to send reset instructions' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
