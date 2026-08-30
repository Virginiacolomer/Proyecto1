import { useState } from "react";
import CambioPreciosMasivoService from "../service/lista-precios-service";
import { ConsultarProductosCambioPreciosMasivo, ConsultarProductosListaPrecios } from "../../../../../interfaces/gestion-producto/producto/interfaces-producto";
import { ResponsePost } from "../../../../../interfaces/generales/interfaces-generales";

export function useCambioPrecios(usuarioId: number | null) {
  const [productos, setProductos] =
    useState<ConsultarProductosListaPrecios[]>([]);
  const [loading, setLoading] = useState(false);

  const buscarProductos = async (filtros: any) => {
    setLoading(true);

    const productosFiltrados =
      await CambioPreciosMasivoService.obtenerDesde(
        filtros,
        "productos"
      );

    setProductos(productosFiltrados.data);
    setLoading(false);
  };

  const aplicarCambios = async (porcentaje: number) => {
    setLoading(true);

    const payload = {
      items: productos,
      porcentaje,
    };

    const productosActualizados =
      await CambioPreciosMasivoService.aplicarCambios(payload);

    setProductos(productosActualizados);
    setLoading(false);
  };

  const guardarCambios = async (): Promise<ResponsePost> => {
    setLoading(true);

    const payload = {
      items: productos,
      usuarioCreatedId: usuarioId,
    };

    const response =
      await CambioPreciosMasivoService.guardarCambios(payload);

    setProductos((prev) =>
      prev.map((p) => ({ ...p, dirty: false }))
    );

    setLoading(false);

    return response;
  };

  const actualizarProductoLocal = (
   productoActualizado: ConsultarProductosListaPrecios
   ) => {
   setProductos((prevProductos) =>
      prevProductos.map((p) =>
         p.id === productoActualizado.id
         ? { ...productoActualizado, dirty: true }
         : p
      )
   );
   };

  return {
    productos,
    loading,
    setProductos,
    buscarProductos,
    aplicarCambios,
    guardarCambios,
    actualizarProductoLocal
  };
}