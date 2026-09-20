import { useEffect, useState } from "react";
import { useFiltrosContext } from "../../../../context/filtros-contesxt";

export function usePresentacionsFiltros() {
  const [filtrosInicializados, setFiltrosInicializados] = useState(false);
  const { setFiltrosNecesarios, valoresFiltros, limpiarFiltros, buscar, setBuscar } =
    useFiltrosContext();

  useEffect(() => {
    limpiarFiltros();
    setBuscar({ cont: 0, componente: "consultar-presentacion" });
    setFiltrosNecesarios({ denominacion: true });
    setFiltrosInicializados(true);
  }, []);

  return {
    filtrosInicializados,
    valoresFiltros,
    buscar,
  };
}
//setean informacion este filtro es para saber que está buscando, en este caso es consultar-presentacion. Solo cambia eso 