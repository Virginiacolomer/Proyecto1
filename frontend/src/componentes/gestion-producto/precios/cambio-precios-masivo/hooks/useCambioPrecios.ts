import { useState } from "react";
import CambioPreciosMasivoService, {
  AumentoMasivoPayload,
} from "../cambio-precios-masivo-service";
import {
  ConsultarProductosCambioPreciosMasivo,
  ResultadoAumentoMasivo,
} from "../../../../../interfaces/gestion-producto/producto/interfaces-producto";

export function useCambioPrecios(usuarioId: number | null) {
  const [productos, setProductos] = useState<
    ConsultarProductosCambioPreciosMasivo[]
  >([]);
  const [ultimoPayload, setUltimoPayload] =
    useState<AumentoMasivoPayload | null>(null);
  const [resultado, setResultado] = useState<ResultadoAumentoMasivo | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // Paso 1 (Decisión #3): calcula la previsualización, no guarda nada.
  const simular = async (payload: AumentoMasivoPayload) => {
    setLoading(true);
    try {
      const preview = await CambioPreciosMasivoService.simular(payload);
      setProductos(preview);
      setUltimoPayload(payload);
      setResultado(null);
    } finally {
      setLoading(false);
    }
  };

  // Paso 2 (Decisión #4): el backend vuelve a calcular todo; acá solo se
  // manda el mismo filtro/ajuste que ya se simuló, más el motivo.
  const aplicar = async (motivo: string) => {
    if (!ultimoPayload) {
      throw new Error("Primero hay que simular un aumento.");
    }
    if (!usuarioId) {
      throw new Error("No se pudo identificar al usuario que aplica el cambio.");
    }

    setLoading(true);
    try {
      const resultadoAplicado = await CambioPreciosMasivoService.aplicar({
        ...ultimoPayload,
        motivo,
        usuarioCreatedId: usuarioId,
      });
      setResultado(resultadoAplicado);
      setProductos([]);
      setUltimoPayload(null);
      return resultadoAplicado;
    } finally {
      setLoading(false);
    }
  };

  const limpiar = () => {
    setProductos([]);
    setUltimoPayload(null);
    setResultado(null);
  };

  return {
    productos,
    resultado,
    loading,
    simular,
    aplicar,
    limpiar,
  };
}
