import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Usuario } from '../../domain/entities/usuario.entity';
import { RolService } from '../../../rol/application/services/rol.service';
import { IUsuarioRepository } from '../../domain/interfaces/usuario-repository.interface';
import { RegistrarUsuarioDto } from '../../../auth/dto/register.dto';
import { UpdateUsuarioDto } from '../../dto/updateUsuario.dto';
import { UsuarioMapper } from '../usuario.mapper';
import { Usuario2Dto } from '../../dto/usuario2.dto';
import { PaginacionUtils } from 'src/modules/common/utils/pagination/paginacion-utils';
import { UpdateContrasenaDto } from '../../dto/updateContrasena.dto';
import * as bcrypt from 'bcrypt';
import { Personal } from 'src/modules/organizacion/personal/domain/entities/personal.entity';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';

@Injectable()
export class UsuarioService {


  private readonly logger = new Logger(UsuarioService.name);
  constructor(
    @Inject('IUsuarioRepository')
    private readonly repository: IUsuarioRepository,

    private readonly rolService: RolService,
  ) {}

  private readonly ENTITY_NAME = 'Usuario';


  async findOne(id: number) {
    const entity = await this.repository.findOne(id);
    if (!entity)
      throw new NotFoundException(`${this.ENTITY_NAME} no encontrado.`);
    return entity;
  }

  async findByMail(mail: string) {
    const entity = await this.repository.findByMail(mail);
    return entity || null;
  }

  async checkByMail(mail: string, id: number) {
    const exists = await this.repository.findByMail(mail);
    if (exists && exists.id !== id) {
      this.logger.warn(
        `${this.ENTITY_NAME} Conflicto: el mail ya está en uso: ${mail}`,
      );
      throw new ConflictException('Denominación ya en uso.');
    }
  }

  async findBy(
    denominacion: string,
    skip = 0,
    take = 10,
  ): Promise<{ data: Usuario2Dto[]; total: number }> {
    this.logger.log(`  Buscando o ${denominacion}  skip=${skip}, take=${take}`);
    const result = await this.repository.findBy(denominacion, skip, take);
    const data: Usuario2Dto[] = result.data.map((marca) =>
      UsuarioMapper.toDto(marca),
    );
    return {
      data,
      total: PaginacionUtils.totalItems(result.total),
    };
  }

  async findAll(skip = 0, take = 10) {
    return this.repository.findAll(skip, take);
  }

  async findAll2() {
    const result = await this.repository.findAll(0, 110);

    const data: Usuario2Dto[] = result.map((linea) =>
      UsuarioMapper.toDto(linea),
    );

    return {
      data,
      total: 1,
    };
  }
  async updateDatos(id: number, dto: UpdateUsuarioDto): Promise<void> {
    const usuario = await this.repository.findOne(id);

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    // Actualizar mail si viene y es distinto
    if (dto.mail && dto.mail !== usuario.mail) {
      const mailEnUso = await this.repository.findByMail(dto.mail);
      if (mailEnUso) {
        throw new ConflictException('El mail ya está en uso por otro usuario');
      }
      usuario.mail = dto.mail;
    }

    // Actualizar denominacion si viene
    if (dto.denominacion) {
      usuario.denominacion = dto.denominacion;
    }

    // Actualizar roles si viene el array
    if (dto.rolesIds !== undefined) {
      if (dto.rolesIds.length === 0) {
        throw new BadRequestException('El usuario debe tener al menos un rol');
      }

      usuario.roles = await this.rolService.findByIds(dto.rolesIds);
  
    }

    await this.repository.updateDatos(usuario);
  }

  async create(dto: RegistrarUsuarioDto) {
    this.logger.log(
      `Creando un nuevo ${this.ENTITY_NAME} con mail: ${dto.mail}`,
    );

    await this.checkByMail(dto.mail, 0);

    const rol = await this.rolService.findOne(dto.rolId);
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${dto.rolId} no encontrada`);
    }

    return this.repository.create(dto, rol);
  }

  async createUsuarioFor(personal: Personal, uow: IUnitOfWork) {
    return this.repository.createUsuarioFor(personal, uow);
  }

  async remove(id: number) {
    const entity = await this.findOne(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    return this.repository.remove(id);
  }

  async findByMailFiltered(mail: string, skip = 0, take = 10) {
    return this.repository.findByMailFiltered(mail, skip, take);
  }

  async save(usuario: Usuario) {
    return this.repository.save(usuario);
  }


  async updateContrasena(id: number, data: UpdateContrasenaDto) {
    if (data.contrasenaNueva !== data.confirmarContrasena) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Buscar el usuario con la contraseña actual
    const usuario = await this.repository.findOne(id);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar que la contraseña actual sea correcta
    const contrasenaValida = await bcrypt.compare(
      data.contrasenaActual,
      usuario.contrasena,
    );
    if (!contrasenaValida) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    // Hashear la nueva contraseña y guardar
    const contrasenaNuevaHasheada = await bcrypt.hash(data.contrasenaNueva, 10);
    usuario.contrasena = contrasenaNuevaHasheada;
    await this.repository.updateContrasena(usuario);
  }


}
