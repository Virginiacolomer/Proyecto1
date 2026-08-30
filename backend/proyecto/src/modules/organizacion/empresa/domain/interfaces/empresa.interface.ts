
import { CondicionIva } from "src/modules/gutil/condicion-iva/domain/entities/condicion-iva.entity";
import { CreateEmpresaDto } from "../../dto/create-empresa.dto";
import { UpdateEmpresaDto } from "../../dto/update-empresa.dto";
import { Empresa } from "../entities/empresa.entity";

export interface IEmpresaRepository {
  
  empresaExist(empresaId: number): Promise<boolean>;

  create(data: CreateEmpresaDto,
     categoriaIva: CondicionIva ):
     Promise<Empresa>;
  
  findAll(skip: number, take: number): Promise<Empresa[]>;
  findOne(id: number): Promise<Empresa | null>;
  findOneWithRelations(id: number): Promise<Empresa | null>;
  findByDenominacion(denominacion: string): Promise<Empresa | null>;
  findByDenominacionFiltered(
    denominacion: string,
    skip: number,
    take: number,
  ): Promise<Empresa[]>;

  update(id: number,
    data: UpdateEmpresaDto,
    categoriaIva: CondicionIva):
    Promise<Empresa>;
  
   remove(id: number): Promise<Empresa>;

}