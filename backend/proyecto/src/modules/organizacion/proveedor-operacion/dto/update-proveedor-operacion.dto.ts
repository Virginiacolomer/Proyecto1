import { PartialType } from '@nestjs/mapped-types';
import { CreateProveedorOperacionDto } from './create-proveedor-operacion.dto';

export class UpdateProveedorOperacionDto extends PartialType(CreateProveedorOperacionDto) {}
