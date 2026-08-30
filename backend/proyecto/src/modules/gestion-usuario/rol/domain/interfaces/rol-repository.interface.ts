import { CreateRolDto } from "../../dto/create-rol.dto";
import { UpdateRolDto } from "../../dto/update-rol.dto";
import { Rol } from "../entities/rol.entity";

export interface IRolRepository {
 
  create(
    data: CreateRolDto)
    : Promise<Rol>;
  findAll(skip: number, take: number): Promise<Rol[]>;
  findOne(id: number): Promise<Rol | null>;
  findByDenominacion(denominacion: string): Promise<Rol | null>;
  findByDenominacionFiltered(
    denominacion: string,
    skip: number,
    take: number,
  ): Promise<Rol[]>;

  update(
      id: number, 
      data: UpdateRolDto): 
      Promise<Rol> ;
  remove(id: number): Promise<Rol>;
  findByIds(ids: number[]): Promise<Rol[]>;
}