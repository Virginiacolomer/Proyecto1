
import { AuditoriaDto } from "src/modules/gestion-sistema/auditoria/dto/auditoria.dto";
import { CreateCondicionIvaDto } from "../../dto/create-condicion-iva.dto";
import { UpdateCondicionIvaDto } from "../../dto/update-condicion-iva.dto";
import { CondicionIva } from "../entities/condicion-iva.entity";


export interface ICondicionIvaRepository {

  create(data: CreateCondicionIvaDto): Promise<CondicionIva>;
  findAllFor(): Promise<CondicionIva[]>;
  findOne(id: number): Promise<CondicionIva | null>;
  findByDenominacion(denominacion: string): Promise<CondicionIva | null>;
  findByDenominacionFiltered(
    denominacion: string,
    skip: number,
    take: number,
  ): Promise<{ data: CondicionIva[]; total: number }>;
  findByIdConAuditoria(id: number):  Promise<AuditoriaDto | null> ;
  update(id: number, data: UpdateCondicionIvaDto): Promise<CondicionIva>;
  remove(data: CondicionIva): Promise<CondicionIva>;
  findAllListado(): Promise<CondicionIva[]>;
}