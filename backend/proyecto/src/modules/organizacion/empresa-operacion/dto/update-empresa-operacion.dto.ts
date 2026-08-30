import { PartialType } from '@nestjs/swagger';
import { CreateEmpresaOperacionDto } from './create-empresa-operacion.dto';

export class UpdateEmpresaOperacionDto extends PartialType(CreateEmpresaOperacionDto) {}
