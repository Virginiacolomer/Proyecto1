import { useEffect, useState } from "react";

export function useProveedoresFiltros() {
  const [inicializados, setInicializados] = useState(false);

  useEffect(() => {
    setInicializados(true);
  }, []);

  return { filtrosInicializados: inicializados };
}
