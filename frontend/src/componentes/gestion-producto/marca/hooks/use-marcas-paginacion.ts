import { useState } from "react";

export function useMarcasPaginacion() {
  const [paginaActual, setPaginaActual] = useState(1);
  const [entidadesTotales, setEntidadesTotales] = useState(0);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);

  const resetearPaginacion = () => {
    setSkip(0);
    setPaginaActual(1);
  };

  return {
    paginaActual,
    entidadesTotales,
    skip,
    take,

    setPaginaActual,
    setEntidadesTotales,
    setSkip,
    setTake,
    resetearPaginacion,
  };
}
 //setees la cantidad de entidades que queres mostrar por pagina tenemos el reset pagina que pasa cuando volves a 0. Take cuantas te trae 