import { PartialType } from '@nestjs/mapped-types';
import { CreateConfiguracionSistemaDto } from './create-configuracion-sistema.dto';

export class UpdateConfiguracionSistemaDto extends PartialType(CreateConfiguracionSistemaDto) {}
