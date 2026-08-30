import { SelectProveedor } from "../../gestion-organizacion/proveedor/interfaces-proveedor";
import { SelectUsuario } from "../../gestion-usuario/interfaces-usuario";
import { SelectMarca } from "../marca/interfaces-marca";

export interface Importacion {
  id: number;
  proveedor: SelectProveedor;
  marca: SelectMarca;
  usuario: SelectUsuario;
  cotizacion: number;
  fecha: string;
}
