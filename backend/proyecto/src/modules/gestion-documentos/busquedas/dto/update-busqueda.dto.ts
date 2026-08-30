import { PartialType } from '@nestjs/swagger';
import { CreateBusquedaDto } from './create-busqueda.dto';

export class UpdateBusquedaDto extends PartialType(CreateBusquedaDto) {}
