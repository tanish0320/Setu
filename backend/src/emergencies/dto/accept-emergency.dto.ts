import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min, IsIn } from 'class-validator';

export class AcceptEmergencyDto {
  @ApiProperty({ description: 'Mode of response (Teleconsultation or Physical Visit)', enum: ['Teleconsultation', 'Physical Visit'], example: 'Physical Visit' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['Teleconsultation', 'Physical Visit'])
  responseMode: 'Teleconsultation' | 'Physical Visit';

  @ApiProperty({ description: 'Estimated time of arrival (ETA) in minutes', example: 15 })
  @IsInt()
  @Min(0)
  eta: number;
}
