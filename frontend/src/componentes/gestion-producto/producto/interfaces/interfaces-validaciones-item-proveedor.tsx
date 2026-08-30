import * as yup from "yup";
import { ItemProveedor } from "../../../interfaces/gestion-producto/producto/interfaces-item-proveedor";

//===================== interfaces para las cosas que se van a ingresar en el formulario y es necesario validarlas ==========//

export interface FormValues {
  codigoProveedor: string;
  proveedorId: number;
}

export interface ItemsProveedorEnPayload {
  codigoProveedor: string;
  proveedorId: number;
  usuarioCreatedId: number;
}

export interface ItemsProveedorTabla {
  codigoProveedor: string;
  proveedor: string;
}

//===================== schema de validacion ============================================//

export const schema = yup.object().shape({
  proveedorId: yup.number().typeError("El proveedor es obligatoria.").required("Debe seleccionar un proveedor."),
  codigoProveedor: yup.string().required("El código proveedor es obligatorio."),
});

//===================== transform data ============================================//

export const transformData = (itemProveedor: ItemProveedor): FormValues => {
  return {
    codigoProveedor: itemProveedor.codigoProveedor || "",
    proveedorId: itemProveedor.proveedorId,
  };
};
