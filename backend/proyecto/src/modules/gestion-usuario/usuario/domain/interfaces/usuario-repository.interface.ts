import { Personal } from "src/modules/organizacion/personal/domain/entities/personal.entity";
import { RegistrarUsuarioDto } from "../../../auth/dto/register.dto";
import { Rol } from "../../../rol/domain/entities/rol.entity";
import { UpdateUsuarioDto } from "../../dto/updateUsuario.dto";
import { Usuario } from "../entities/usuario.entity";
import { IUnitOfWork } from "src/modules/common/unit-of-work/iunit-of-work.";

export interface IUsuarioRepository {
  
  
  createUsuarioFor(personal: Personal, uow: IUnitOfWork) : Promise<Usuario>;

  findBy(
    denominacion: string,
    skip: number,
    take: number,
  ): Promise<{ data: Usuario[]; total: number } >;
  findOne(id: number): Promise<Usuario | null>;

  findByMail(mail: string): Promise<Usuario | null>;

  update( id: number, data: UpdateUsuarioDto, rol:Rol): Promise<Usuario> ;

  findAll(skip: number, take: number): Promise<Usuario[]>;

  create( data: RegistrarUsuarioDto, rol: Rol) : Promise<Usuario>;

  remove(id: number): Promise<Usuario>;

  findByMailFiltered( mail: string, skip: number, take: number, ): Promise<Usuario[]>;

  save(usuario: Usuario): Promise<Usuario>;
  

  findOneWithRoles(id: number): Promise<Usuario | null>;

  updateContrasena(usuario: Usuario): Promise<Usuario>;
  updateDatos(usuario: Usuario): Promise<Usuario>;
}