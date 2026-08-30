import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { CreateClienteDto } from '../cliente/dto/create-cliente.dto';
import { UpdateClienteDto } from '../cliente/dto/update-cliente.dto';
import { CondicionIvaValidationHelper } from 'src/modules/gutil/condicion-iva/helpers/condicion-iva-validation-helper';
import { IClienteRepository } from '../cliente/domain/interfaces/cliente.interface';
import { Personal } from '../personal/domain/entities/personal.entity';
import { PersonalService } from '../personal/application/services/personal.service';
import { CondicionIva } from 'src/modules/gutil/condicion-iva/domain/entities/condicion-iva.entity';

@Injectable()
export class ClienteValidationHelper {
  private readonly logger = new Logger(ClienteValidationHelper.name);
  constructor(
    private readonly condicionIvaValidationHelper: CondicionIvaValidationHelper,
    private readonly usuarioService: UsuarioService,
    private readonly personalService: PersonalService,

    @Inject('IClienteRepository')
    private readonly clienteRepository: IClienteRepository,
  ) { }

  async validateAndGetCondicionIva(
    dto: CreateClienteDto | UpdateClienteDto,
  ): Promise<CondicionIva> {

    this.logger.log(`Creando un nuevo g1`);
    const condicionIva =
      await this.condicionIvaValidationHelper.validateAndGetCondicionIva(
        dto.condicionIvaId,
      );

    this.logger.log(`condicionIva: ${JSON.stringify(condicionIva)}`);
    this.condicionIvaValidationHelper.validateCondicionIvaRequirements(
      condicionIva,
      dto,
    );
    return condicionIva;
  }


  async validateAndGetPersonal(
    dto: CreateClienteDto | UpdateClienteDto,
  ): Promise<Personal> {

    this.logger.log(`Creando un nuevo g1`);
    const personal =
      await this.personalService.findEntityById(
        dto.vendedorId,
      );

    return personal;
  }


  async validateAndGetUsuario(id: number) {
    const usuario = await this.usuarioService.findOne(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);

    }
    return usuario;
  }

  async validateAndGetCuitUnique(
    cuit?: string,
    idActual?: number,
  ): Promise<void> {
    if (!cuit?.trim()) return;

    const existente = await this.clienteRepository.findByCuit(cuit.trim());
    if (existente && existente.id !== idActual) {
      throw new BadRequestException(`Ya existe un cliente con CUIT ${cuit}`);
    }
  }

  async validateAndGetDniUnique(
    dni?: string,
    idActual?: number,
  ): Promise<void> {
    if (!dni?.trim()) return;

    const existente = await this.clienteRepository.findByDni(dni.trim());
    if (existente && existente.id !== idActual) {
      throw new BadRequestException(`Ya existe un cliente con Dni ${dni}`);
    }
  }



  async validateAndGetDenominacionUnique(denominacion: string, id: number) {
    const exists =
      await this.clienteRepository.findByDenominacion(denominacion);
    if (exists && exists.id !== id) {
      this.logger.warn(
        `Conflicto: denominación ya está en uso: ${denominacion}`,
      );
      throw new ConflictException('Denominación ya en uso.');
    }
  }

  async validateCreateCliente(dto: CreateClienteDto) {
    const denominacion = await this.validateAndGetDenominacionUnique(
      dto.denominacion,
      0,
    );
    const personal = await this.validateAndGetPersonal(dto);
    const usuario = await this.validateAndGetUsuario(dto.usuarioCreatedId);
    const categoriaIVA = await this.validateAndGetCondicionIva(dto);
    await this.validateAndGetCuitUnique(dto.cuit, 0);
    /**
     * no controla por pedido del cliente el dni
     */
    // await this.validateAndGetDniUnique(dto.dni, 0);
    return { usuario, categoriaIVA, personal };
  }

  async validateUpdateCliente(id: number, dto: UpdateClienteDto) {
    await this.clienteRepository.findOne(id); // validar existencia del proveedor

    if (dto.denominacion) {
      await this.validateAndGetDenominacionUnique(dto.denominacion, id);
    }
    const usuario = await this.validateAndGetUsuario(dto.usuarioUpdatedId);
    const categoriaIVA = await this.validateAndGetCondicionIva(dto);
    const personal = await this.validateAndGetPersonal(dto);
    await this.validateAndGetCuitUnique(dto.cuit, id);
    await this.validateAndGetDniUnique(dto.dni, id);

    return { usuario, categoriaIVA, personal };
  }

}
