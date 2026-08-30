import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { CondicionIvaValidationHelper } from 'src/modules/gutil/condicion-iva/helpers/condicion-iva-validation-helper';
import { CreateProveedorDto } from '../proveedor/dto/create-proveedor.dto';
import { UpdateProveedorDto } from '../proveedor/dto/update-proveedor.dto';
import { IProveedorRepository } from '../proveedor/domain/interfaces/proveedor.interface';
import { CondicionIva } from 'src/modules/gutil/condicion-iva/domain/entities/condicion-iva.entity';

@Injectable()
export class ProveedorValidationHelper {
  private readonly logger = new Logger(ProveedorValidationHelper.name);
  constructor(
    private readonly condicionIvaValidationHelper: CondicionIvaValidationHelper,
    private readonly usuarioService: UsuarioService,

    @Inject('IProveedorRepository')
    private readonly proveedorRepository: IProveedorRepository,
  ) { }

  async validateAndGetCondicionIva(
    dto: CreateProveedorDto | UpdateProveedorDto,
  ): Promise<CondicionIva> {
    // Validar CondicionIva

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

  async validateAndGetUsuario(id: number) {
    const usuario = await this.usuarioService.findOne(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  async validateAndGetCuitUnique(
    cuit?: string,
    idProveedorActual?: number,
  ): Promise<void> {
    if (!cuit?.trim()) return;

    const existente = await this.proveedorRepository.findByCuit(cuit.trim());
    if (existente && existente.id !== idProveedorActual) {
      throw new BadRequestException(`Ya existe un proveedor con CUIT ${cuit}`);
    }
  }


  async validateAndGetDenominacionUnique(denominacion: string, id: number) {
    const exists =
      await this.proveedorRepository.findByDenominacion(denominacion);
    if (exists && exists.id !== id) {
      this.logger.warn(
        `Conflicto: denominación ya está en uso: ${denominacion}`,
      );
      throw new ConflictException('Denominación ya en uso.');
    }
  }

  async validateCreateProveedor(dto: CreateProveedorDto) {
    const denominacion = await this.validateAndGetDenominacionUnique(
      dto.denominacion,
      0,
    );
    const usuario = await this.validateAndGetUsuario(dto.usuarioCreatedId);
    const categoriaIVA = await this.validateAndGetCondicionIva(dto);
    await this.validateAndGetCuitUnique(dto.cuit, 0);

    return { usuario, categoriaIVA };
  }

  async validateUpdateProveedor(id: number, dto: UpdateProveedorDto) {
    await this.proveedorRepository.findOne(id); // validar existencia del proveedor

    if (dto.denominacion) {
      await this.validateAndGetDenominacionUnique(dto.denominacion, id);
    }
    const usuario = await this.validateAndGetUsuario(dto.usuarioUpdatedId);
    const categoriaIVA = await this.validateAndGetCondicionIva(dto);
    await this.validateAndGetCuitUnique(dto.cuit, id);

    return { usuario, categoriaIVA };
  }
}
