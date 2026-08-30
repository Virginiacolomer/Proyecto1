import { useEffect, useState } from "react";
import { useFiltrosContext } from "../../../../context/filtros-contesxt";

export function useUsuariosFiltros() {
  const [inicializados, setInicializados] = useState(false);
  const {
    setFiltrosNecesarios,
    limpiarFiltros,
    setBuscar,
  } = useFiltrosContext();

  useEffect(() => {
    limpiarFiltros();
    setBuscar({ cont: 0, componente: "consultar-usuario" });
    setFiltrosNecesarios({ denominacion: true, condicionIva: true });
    setInicializados(true);
  }, []);

  return { filtrosInicializados: inicializados };
}
