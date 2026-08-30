
import { CreateProvinciaDto } from "../../dto/create-provincia.dto";
import { UpdateProvinciaDto } from "../../dto/update-provincia.dto";
import { Provincia } from "../entities/provincia.entity";


export interface IProvinciaRepository {

  create(data: CreateProvinciaDto): Promise<Provincia>;
  findAll(skip: number, take: number): Promise<Provincia[]>;
  findAllFor(): Promise<Provincia[]>;
  findOne(id: number): Promise<Provincia | null>;
  findByDenominacion(denominacion: string): Promise<Provincia | null>;
  findByDenominacionFiltered(
    denominacion: string,
    skip: number,
    take: number,
  ): Promise<Provincia[]>;

  update(id: number,
    data: UpdateProvinciaDto):
    Promise<Provincia>;
  remove(data: Provincia): Promise<Provincia>;

}
