import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'priya.patel@apollo.in', description: 'User login email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Priya@12345', description: 'Minimum 6 character password' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'Dr. Priya Patel', description: 'Full clinical name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Doctor', description: 'Default role' })
  @IsString()
  @IsNotEmpty()
  roleName: string;
}
