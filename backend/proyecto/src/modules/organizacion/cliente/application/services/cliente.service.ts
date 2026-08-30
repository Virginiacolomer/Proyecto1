import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateClienteDto } from '../../dto/create-cliente.dto';
import { UpdateClienteDto } from '../../dto/update-cliente.dto';
import { IClienteRepository } from '../../domain/interfaces/cliente.interface';
import { LocalidadService } from 'src/modules/gutil/localidad/application/services/localidad.service';
import { CondicionIvaService } from 'src/modules/gutil/condicion-iva/application/services/condicion-iva.service';
import { ClienteMapper } from '../../mappers/cliente.mapper';
import { ListadoConTotalDto } from 'src/modules/common/interface/listadoConTotalDto';
import { CondicionIvaDto } from 'src/modules/gutil/condicion-iva/dto/condicion-iva.dto';
import { LocalidadDto } from 'src/modules/gutil/localidad/dto/localidad.dto';
import { ProvinciaDto } from 'src/modules/gutil/provincia/dto/provincia.dto';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { ClienteValidationHelper } from '../../../helpers/cliente-validation-helper';
import { AuditoriaMapper } from 'src/modules/gestion-sistema/auditoria/mappers/auditoria.mapper';
import { OperadorSearchDto } from 'src/modules/gestion-documentos/operador-search.dto';
import { MessageFrontUtils } from 'src/modules/common/utils/message/message-front.util';
import { PersonalService } from '../../../personal/application/services/personal.service';
import { PersonalSearchDto } from '../../../personal/dto/personal-search.dto';
import { EmpresaService } from '../../../empresa/application/services/empresa.service';
import { ProvinciaService } from 'src/modules/gutil/provincia/application/services/provincia.service';

@Injectable()
export class ClienteService {
  private readonly logger = new Logger(ClienteService.name);
  constructor(
    @Inject('IClienteRepository')
    private readonly repository: IClienteRepository,

    private readonly condicionIvaService: CondicionIvaService,
    private readonly localidadService: LocalidadService,
    private readonly provinciaService: ProvinciaService,
    private readonly personalService: PersonalService,
    private readonly usuarioService: UsuarioService,
    private readonly empresaService: EmpresaService,
    private readonly validator: ClienteValidationHelper,
  ) {}

  private readonly ENTITY_NAME = 'Cliente';

  async create(dto: CreateClienteDto) {
    this.logger.log(
      `Creando un nuevo ${this.ENTITY_NAME} con denominación: ${dto.denominacion} a: ${dto.denominacion}`,
    );

    const { usuario, categoriaIVA, personal } =
      await this.validator.validateCreateCliente(dto);
    const localidad = await this.localidadService.findEntityById(
      dto.domicilio.localidadId,
    );
    if (!localidad) {
      throw new NotFoundException(
        `localidad con ID ${dto.domicilio.localidadId} no encontrada`,
      );
    }

    this.logger.log(
      `Creando un nuevo ${this.ENTITY_NAME} con loacliadad: ${dto.domicilio.localidadId}`,
    );

    const entity = await this.repository.create(
      dto,
      categoriaIVA,
      localidad,
      personal,
      usuario,
    );

    return MessageFrontUtils.createSimple(
      `${this.ENTITY_NAME}`,
      dto.denominacion,
      'creada',
    );
  }

  async update(id: number, dto: UpdateClienteDto) {
    this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);

    const { usuario, categoriaIVA, personal } =
      await this.validator.validateUpdateCliente(id, dto);

    if (!dto.domicilio?.localidadId) {
      throw new BadRequestException('El ID de la localidad es obligatorio.');
    }
    this.logger.log(
      `Actualizando  ${this.ENTITY_NAME} con ID: ${dto.domicilio?.localidadId}`,
    );
    const localidad = await this.localidadService.findEntityById(
      dto.domicilio.localidadId,
    );
    if (!localidad) {
      throw new NotFoundException(
        `localidad con ID ${dto.domicilio.localidadId} no encontrada`,
      );
    }

    const entity = await this.repository.update(
      id,
      dto,
      categoriaIVA,
      localidad,
      personal,
      usuario,
    );
    return MessageFrontUtils.createSimple(
      `${this.ENTITY_NAME}`,
      entity.denominacion,
      'editada',
    );
  }


  async findByDenominacionFiltered(
    empresaId: number,
    denominacion: string,
    condicionIvaId: number,
    conSaldo?: boolean,
    skip = 0,
    take = 10,
    incluirEliminados = false,
  ): Promise<{ data: OperadorSearchDto[]; total: number }> {
    this.logger.log(
      `  Buscando 111o ${denominacion}  skip=${skip}, take=${take}`,
    );
    const result = await this.repository.findBy(
      denominacion,
      condicionIvaId,
      incluirEliminados,
      empresaId,
      conSaldo,
      skip,
      take,
    );

    const data = result.data.map((cliente) =>
      ClienteMapper.toOperadorSearchDto(
        cliente,
        empresaId,
      ),
    );

    return {
      data,
      total: result.total,
    };
  }

  async findAllByDenominacion(
    empresaId: number,
    denominacion: string,
  ): Promise<{ data: OperadorSearchDto[]; total: number }> {
    this.logger.log(`  Buscando o ${denominacion} `);
    const clientes = await this.repository.findAllByDenominacion(denominacion);
    const data = clientes.map((cliente) =>
      ClienteMapper.toOperadorSearchDto(cliente, empresaId),
    );

    return {
      data,
      total: data.length,
    };
  }

  async findAllByDenominacionAndCodigo(
    empresaId: number,
    denominacion: string,
  ): Promise<{ data: OperadorSearchDto[]; total: number }> {
    this.logger.log(`  Buscando o ${denominacion} `);
    const clientes =
      await this.repository.findAllByDenominacionAndCodigo(denominacion);
    const data = clientes.map((cliente) =>
      ClienteMapper.toOperadorSearchDto(cliente, 1),
    );

    return {
      data,
      total: data.length,
    };
  }

  async findAllByVendedorDenominacion(
    denominacion: string,
  ): Promise<{ data: PersonalSearchDto[]; total: number }> {
    this.logger.log(`Buscando ${denominacion} `);
    return await this.personalService.findAllVendedorByDenominacion(
      denominacion,
    );
  }

  async findAllCondicionIva(): Promise<ListadoConTotalDto<CondicionIvaDto>> {
    return this.condicionIvaService.findAllFor();
  }

  async findAllLocalidad(): Promise<ListadoConTotalDto<LocalidadDto>> {
    return this.localidadService.findAllFor();
  }

  async findAllLocalidadFor(
    provinciaId: number,
  ): Promise<ListadoConTotalDto<LocalidadDto>> {
    return this.localidadService.findAllForProvincia(provinciaId);
  }

  async findAllProvincia(): Promise<ListadoConTotalDto<ProvinciaDto>> {
    return this.provinciaService.findAllFor();
  }

  async buscarCondicionIvaDesdeCliente(id: number) {
    return this.condicionIvaService.findEntityById(id);
  }

  async findByIdConAuditoria(id: number) {
    const entity = await this.repository.findByIdConAuditoria(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    return AuditoriaMapper.mapClienteToDto(entity);
  }

  async findDtoById(id: number, empresaId: number) {
    const entity = await this.repository.findOne(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    this.logger.log(`  Buscando 3 `);
    return ClienteMapper.toOperadorDto(entity, empresaId);
  }

  async findEntityById(id: number) {
    const entity = await this.repository.findOne(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    return entity;
  }
 
  async findEntityByIdWithRelations(id: number) {
    const entity = await this.repository.findOneWithRelations(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    return entity;
  }

  async remove(id: number, usuarioId: number) {
    const entity = await this.findEntityById(id);
    if (!entity) {
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    }

    const usuario = await this.usuarioService.findOne(usuarioId);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado.`);
    }

    await this.repository.remove(id, usuario);
    return MessageFrontUtils.createSimple(
      `${this.ENTITY_NAME}`,
      entity.denominacion,
      'eliminada',
    );
  }

  private async checkDenominacionExists(denominacion: string, id: number) {
    const exists = await this.repository.findByDenominacion(denominacion);
    if (exists && exists.id !== id) {
      this.logger.warn(
        `${this.ENTITY_NAME} Conflicto: denominación ya está en uso: ${denominacion}`,
      );
      throw new ConflictException('Denominación ya en uso.');
    }
  }


  private async checkCuitOrDniExists(
    cuit?: string,
    dni?: string,
    idClienteActual?: number,
  ): Promise<void> {
  
  }


}
