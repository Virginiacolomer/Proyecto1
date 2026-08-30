import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class Usuario2Dto {

  @ApiProperty({ example: 123, description: 'ID del tipo movimiento bancario.' })
  @Type(() => Number)
  @IsInt()
  id: number;

  @ApiProperty({ example: 'IVECO', description: 'Denominación del tipo movimiento' })
  @IsString()
  denominacion: string;


}
