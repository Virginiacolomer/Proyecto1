import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BaseProductoDto } from '../interfaces/base-producto.interface';
import { UsuarioValidator } from 'src/modules/common/utils/validation/usuario-validator';
import { MarcaService } from 'src/modules/gestion-productos/marca/application/services/marca.service';
import { IProductoRepository } from '../interfaces/producto.repository-interface';

@Injectable()
export class ProductoValidator {
  private readonly ENTITY_NAME = 'Producto';

  constructor(
    private readonly marcaService: MarcaService,

    private readonly usuarioValidator: UsuarioValidator,

    @Inject('IProductoRepository')
    private readonly repository: IProductoRepository,
  ) {}

  private assertEntidadValida(entidad: any, tipo: string) {
    if (!entidad) {
      throw new NotFoundException(`${tipo} no encontrada`);
    }

    if (entidad.sistema === 1) {
      throw new BadRequestException(
        `${tipo} ${entidad.id} está marcada como del sistema y no puede usarse.`,
      );
    }
  }

  async validarMarcaLinea(dto: BaseProductoDto, tipo: number) {
    const { lineaId, marcaId } = dto;

    if (lineaId === undefined) {
      throw new Error('Linea ID is required');
    }
    if (marcaId === undefined) {
      throw new Error('Marca ID is required');
    }

    let marca,
      linea;
 
      // Si tiene sublínea
      [marca] = await Promise.all([
        this.marcaService.findEntityById(marcaId),

      ]);


    if (tipo === 0) {
      this.assertEntidadValida(marca, 'Marca');
      this.assertEntidadValida(linea, 'Línea');
    }

    return { marca, linea, };
  }

  private validarCamposRequeridos(dto: BaseProductoDto) {

  }

  async validar(dto: BaseProductoDto, tipo: number) {
    this.validarCamposRequeridos(dto);
    await this.validateUniqueDenominacion(dto.denominacion, 0);
    return await this.validarMarcaLinea(dto, tipo);
  }

  async validarUsuarioExiste(id: number) {
    //
    //  const usuario = await this.usuarioService.findOne(id);
    const usuario = await this.usuarioValidator.validarUsuarioExiste(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  private async validateUniqueDenominacion(
    denominacion: string,
    excludeId?: number,
  ): Promise<void> {
    const existingProduct = await this.repository.existsByDenominacion(
      denominacion,
      excludeId,
    );

    if (existingProduct) {

      throw new ConflictException(
        `La denominación "${denominacion}" ya está en uso.`,
      );
    }
  }
}
