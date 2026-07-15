import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({ description: 'UUID of the new role', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  roleId: string;
}
