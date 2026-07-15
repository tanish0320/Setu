import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ description: 'Department name', example: 'Cardiology' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Department description', example: 'Cardiology and vascular medicine' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Department status', example: 'active', default: 'active' })
  @IsOptional()
  @IsString()
  status?: string = 'active';

  @ApiProperty({ description: 'ID of the hospital this department belongs to', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  hospitalId: string;

  @ApiPropertyOptional({ description: 'ID of the doctor heading this department', example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsOptional()
  @IsUUID()
  headId?: string;
}
