import { useEffect, useState } from "react";

export function useClientesFiltros() {
  const [inicializados, setInicializados] = useState(false);

  useEffect(() => {
    setInicializados(true);
  }, []);

  return { filtrosInicializados: inicializados };
}
