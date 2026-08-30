import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IConfiguracionSistemaRepository } from '../../domain/interfaces/configuracion-sistema.repository.interface';
import { ConfiguracionSistemaMapper } from '../../mappers/configuracion-sistema.mapper';

@Injectable()
export class ConfiguracionSistemaService {
  private readonly logger = new Logger(ConfiguracionSistemaService.name);

  constructor(
    @Inject('IConfiguracionSistemaRepository')
    private readonly repository: IConfiguracionSistemaRepository,
  ) {}

  private readonly ENTITY_NAME = 'ConfiguracionSistema';

  async findDtoById(id: number) {
    const entity = await this.repository.findOne(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    return ConfiguracionSistemaMapper.toDto(entity);
  }

  async findDtoByEmpresaId(empresaId: number) {
 
    return {
    id: 1,
    empresaId: empresaId,

    caracteresParaBusqueda: 3,
    ocultarTotalesDocumento: false,

    visibleSubTotalNoGravado: true,
    visibleSubTotal: true,
    visibleIva105: true,
    visibleIva21: true,
    precioConIvaVisible: true,

    libroCajaUnica: true,
    carteraChequeUnica: true,

    take: 10,
    estadisticasProducto: true,
    busquedaInicial: true,
    maximoDolar: 1000,

    porcentajeAumento: 0,
    unidadMedida: true,
    precioOferta: false,
    costoDolar: false,

    clientePoseePersonal: false,
    electronica: false,
  };
  }

  async findEntityById(id: number) {
    const entity = await this.repository.findOne(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    return entity;
  }
}
