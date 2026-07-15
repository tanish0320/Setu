import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'some-secure-reset-token', description: 'Reset token sent via email' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'NewPriya@12345', description: 'New 6+ character password' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;
}
