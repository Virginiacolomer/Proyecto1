import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';

import { CreateConfiguracionSistemaDto } from '../../dto/create-configuracion-sistema.dto';
import { ConfiguracionSistema } from '../entities/configuracion-sistema.entity';
import { UpdateConfiguracionSistemaDto } from '../../dto/update-configuracion-sistema.dto';

export interface IConfiguracionSistemaRepository {
  create(data: CreateConfiguracionSistemaDto): Promise<ConfiguracionSistema>;
  findOne(id: number): Promise<ConfiguracionSistema | null>;
  
  findDtoByEmpresaId(empresaId: number) : Promise<ConfiguracionSistema | null>;
  update(
    id: number,
    data: UpdateConfiguracionSistemaDto,
  ): Promise<ConfiguracionSistema>;

  remove(
    data: ConfiguracionSistema,
    usuario: Usuario,
  ): Promise<ConfiguracionSistema>;
}
