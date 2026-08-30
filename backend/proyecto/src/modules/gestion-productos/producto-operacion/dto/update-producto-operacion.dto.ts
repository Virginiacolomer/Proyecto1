import { PartialType } from '@nestjs/swagger';
import { CreateProductoOperacionDto } from './create-producto-operacion.dto';

export class UpdateProductoOperacionDto extends PartialType(CreateProductoOperacionDto) {}
