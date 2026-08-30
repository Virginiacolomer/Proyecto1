import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProveedorDto } from '../../dto/create-proveedor.dto';
import { UpdateProveedorDto } from '../../dto/update-proveedor.dto';
import { IProveedorRepository } from '../../domain/interfaces/proveedor.interface';
import { LocalidadService } from 'src/modules/gutil/localidad/application/services/localidad.service';
import { CondicionIvaService } from 'src/modules/gutil/condicion-iva/application/services/condicion-iva.service';
import { GetProveedorDto } from '../../dto/get-proveedor.dto';
import { ProveedorMapper } from '../../mappers/proveedor.mapper';
import { OperadorDto } from 'src/modules/gestion-documentos/operador.dto';
import { ListadoConTotalDto } from 'src/modules/common/interface/listadoConTotalDto';
import { CondicionIvaDto } from 'src/modules/gutil/condicion-iva/dto/condicion-iva.dto';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { ProveedorValidationHelper } from '../../../helpers/proveedor-validation-helper';
import { LocalidadDto } from 'src/modules/gutil/localidad/dto/localidad.dto';
import { ProvinciaDto } from 'src/modules/gutil/provincia/dto/provincia.dto';

import { AuditoriaMapper } from 'src/modules/gestion-sistema/auditoria/mappers/auditoria.mapper';
import { OperadorSearchDto } from 'src/modules/gestion-documentos/operador-search.dto';
import { MessageFrontUtils } from 'src/modules/common/utils/message/message-front.util';

import { ProvinciaService } from 'src/modules/gutil/provincia/application/services/provincia.service';

@Injectable()
export class ProveedorService {
  private readonly logger = new Logger(ProveedorService.name);
  constructor(
    @Inject('IProveedorRepository')
    private readonly repository: IProveedorRepository,

    private readonly condicionIvaService: CondicionIvaService,
    private readonly localidadService: LocalidadService,
    private readonly provinciaService: ProvinciaService,
    private readonly usuarioService: UsuarioService,
    private readonly validator: ProveedorValidationHelper,
  ) { }

  private readonly ENTITY_NAME = 'Proveedor';

  async create(dto: CreateProveedorDto) {
    const { usuario, categoriaIVA } =
      await this.validator.validateCreateProveedor(dto);

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
      usuario,
    );

    return MessageFrontUtils.createSimple(
      `${this.ENTITY_NAME}`,
      dto.denominacion,
      'creada',
    );
  }

  async update(id: number, dto: UpdateProveedorDto) {
    this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);

    const { usuario, categoriaIVA } =
      await this.validator.validateUpdateProveedor(id, dto);

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
      usuario,
    );
    return MessageFrontUtils.createSimple(
      `${this.ENTITY_NAME}`,
      entity.denominacion,
      'editada',
    );
  }


  async findBy(
    empresaId: number,
    denominacion: string,
    condicionIvaId: number,
    conSaldo?: boolean,
    skip = 0,
    take = 10,
    incluirEliminados = false,
  ): Promise<{ data: OperadorSearchDto[]; total: number }> {
    this.logger.log(`  Buscando o ${denominacion}  skip=${skip}, take=${take}`);
    const result = await this.repository.findBy(
      denominacion,
      condicionIvaId,
      incluirEliminados,
      empresaId,
      conSaldo,
      skip,
      take,
    );
    this.logger.log(
      `  Buscando 4o ${denominacion}  skip=${skip}, take=${take}`,
    );



    const data = result.data.map((proveedor) =>
      ProveedorMapper.toOperadorSearchDto(
        proveedor,
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
  ): Promise<{ data: OperadorDto[]; total: number }> {
    this.logger.log(`  Buscando o ${denominacion} `);
    const proveedores =
      await this.repository.findAllByDenominacion(denominacion);
    const data = proveedores.map((proveedor) =>
      ProveedorMapper.toOperadorDto(proveedor, empresaId),
    );

    return {
      data,
      total: data.length,
    };
  }

  async findAllByDenominacion2(
    empresaId: number,
    denominacion: string,
  ): Promise<{ data: OperadorSearchDto[]; total: number }> {
    this.logger.log(`  Buscando o ${denominacion} `);
    const proveedores =
      await this.repository.findAllByDenominacion(denominacion);
    const data = proveedores.map((proveedor) =>
      ProveedorMapper.toOperadorSearchDto(proveedor, empresaId),
    );

    return {
      data,
      total: data.length,
    };
  }

  async findAllByTipo(
    empresaId: number,
    denominacion: string,
    compra: boolean,
    gasto: boolean,
  ): Promise<{ data: OperadorSearchDto[]; total: number }> {
    this.logger.log(`  Buscando by tipo    ${denominacion} `);
    const proveedores = await this.repository.findAllByTipo(
      denominacion,
      compra,
      gasto,
    );
    const data = proveedores.map((proveedor) =>
      ProveedorMapper.toOperadorSearchDto(proveedor, empresaId),
    );

    return {
      data,
      total: data.length,
    };
  }

  async findAllCondicionIva(): Promise<ListadoConTotalDto<CondicionIvaDto>> {
    return this.condicionIvaService.findAllSinConsumidorFinal();
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
    return AuditoriaMapper.mapProveedorToDto(entity);
  }

  async findDtoById(id: number, empresaId: number) {
    const entity = await this.repository.findOne(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    this.logger.log(`  Buscando o`);
    return ProveedorMapper.toDto2(entity, empresaId);
  }

  async findEntityById(id: number) {
    const entity = await this.repository.findOne(id);
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




  async findAllFor(
    denominacion: string,
  ): Promise<{ data: GetProveedorDto[]; total: number }> {
    const result = await this.repository.findAllFor(denominacion);
    const data: GetProveedorDto[] = result.map((proveedor) =>
      ProveedorMapper.toDto(proveedor),
    );
    return {
      data,
      total: data.length, // o 0 si querés dejarlo fijo
    };
  }

  async findAllSistemaFor(
    denominacion: string,
  ): Promise<{ data: GetProveedorDto[]; total: number }> {
    const result = await this.repository.findAllSistemaFor(denominacion);
    const data: GetProveedorDto[] = result.map((proveedor) =>
      ProveedorMapper.toDto(proveedor),
    );
    return {
      data,
      total: data.length, // o 0 si querés dejarlo fijo
    };
  }

  async findAllSinSistemaFor(
    denominacion: string,
  ): Promise<{ data: GetProveedorDto[]; total: number }> {
    const result = await this.repository.findAllSinSistemaFor(denominacion);
    const data: GetProveedorDto[] = result.map((proveedor) =>
      ProveedorMapper.toDto(proveedor),
    );
    return {
      data,
      total: data.length, // o 0 si querés dejarlo fijo
    };
  }



}
