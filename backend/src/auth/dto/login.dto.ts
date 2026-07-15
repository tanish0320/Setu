import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'priya.patel@apollo.in', description: 'User login email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Priya@12345', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
