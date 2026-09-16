import { PartialType } from '@nestjs/swagger';
import { CreateSuperLineaDto } from './create-super-linea.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateSuperLineaDto extends PartialType(CreateSuperLineaDto) {
  @IsOptional()
  @IsInt({ message: 'El usuarioUpdatedId debe ser un número entero.' })
  usuarioUpdatedId?: number;
}
