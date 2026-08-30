import * as yup from "yup";
import { ItemProdAlternativo } from "../../../../interfaces/gestion-producto/producto/interfaces-item-prod-alternativo";

//===================== interfaces para las cosas que se van a ingresar en el formulario y es necesario validarlas ==========//

export interface FormValues {
  productoAlternativoId: number;
}

export interface ItemsProdAlternativoEnPayload {
  productoAlternativoId: number;
  usuarioCreatedId: number;
}

export interface ItemsProdAlternativoTabla {
  productoAlternativo: string;
  numeroPieza: string;
  proveedor: string;
}

//===================== schema de validacion ============================================//

export const schema = yup.object().shape({
  productoAlternativoId: yup
    .number()
    .typeError("El producto es obligatoria.")
    .required("Debe seleccionar un producto."),
});

//===================== transform data ============================================//

export const transformData = (itemProductoAlternativo: ItemProdAlternativo): FormValues => {
  return {
    productoAlternativoId: itemProductoAlternativo.productoAlternativoId,
  };
};
