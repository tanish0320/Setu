import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString, IsOptional } from 'class-validator';

export class UpdateRoleDto {
  @ApiPropertyOptional({ description: 'The unique name of the role', example: 'Admin' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'List of permissions assigned to this role', example: ['users:read', 'users:create'] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  permissions?: string[];
}
