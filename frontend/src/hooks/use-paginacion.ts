import { useState, useCallback } from "react";

export const usePaginacion = (takeInicial: number = 10) => {
  const [paginaActual, setPaginaActual] = useState(1);
  
  const [entidadesTotales, setEntidadesTotales] = useState(1);
  const [skip, setSkip] = useState(0);
  
  const [take, setTake] = useState(takeInicial);

  const handlePageChange = useCallback((skip: number, take: number, paginaActual: number) => {
    //console.log("📄 Cambio de página:", { skip, take, paginaActual });
    setSkip(skip);
    setTake(take);
    setPaginaActual(paginaActual);
  }, []);

  const resetearPaginacion = useCallback(() => {
    //console.log("🔄 Reseteando paginación a página 1");
    setSkip(0);
    setPaginaActual(1);
  }, []);

  
  return {
    paginaActual,
    entidadesTotales,
    skip,
    take,
    
    setPaginaActual,
    setEntidadesTotales,
    setSkip,
    setTake,
    
    handlePageChange,
    resetearPaginacion,
  };
};

