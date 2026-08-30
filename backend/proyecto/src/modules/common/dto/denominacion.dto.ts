import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DenominacionDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Denominación a filtrar' })
  denominacion?: string;
}
