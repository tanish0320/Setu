import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: 'The unique name of the role', example: 'Admin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'List of permissions assigned to this role', example: ['users:read', 'users:create'] })
  @IsArray()
  @IsString({ each: true })
  permissions: string[];
}
