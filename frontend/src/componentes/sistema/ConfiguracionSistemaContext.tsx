import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ConfiguracionSistema } from "../../interfaces/generales/interfaces-generales";

interface ConfiguracionContextType {
  configuracion: ConfiguracionSistema | null;
  setConfiguracionEnContext: (config: ConfiguracionSistema) => void;
}

const CONFIGURACION_DEFAULT: ConfiguracionSistema = {
  id: 1,
  empresaId: 1,
  precioOferta: false,
  caracteresParaBusqueda: 3,
  visibleSubTotalNoGravado: true,
  visibleSubTotal: true,
  visibleIva105: true,
  visibleIva21: true,
  busquedaInicial: true,
  estadisticasProducto: false,
  libroCajaUnica: true,
  precioConIvaVisible: true,
  maximoDolar: 1000,
  take: 10,
  porcentajeAumento: 0,
  unidadMedida: true,
  costoDolar: false,
  ocultarTotalesDocumento: false,
  maxDigitosPrecio: 10,
  maxDigitosPorcentajePrecioMayorista: 5,
  maxDigitosPorcentajePrecio: 5,
};

const ConfiguracionContext = createContext<ConfiguracionContextType | undefined>(undefined);

export const ConfiguracionSistemaProvider = ({ children }: { children: ReactNode }) => {
  //const [configuracion, setConfiguracionState] = useState<ConfiguracionSistema | null>(null);
  const [configuracion, setConfiguracionState] = useState<ConfiguracionSistema>(CONFIGURACION_DEFAULT);

  console.log("esta es la configuracion", configuracion);

  // useEffect(() => {
  //   const stored = sessionStorage.getItem("ConfiguracionSistema");
  //   if (stored) {
  //     setConfiguracionState(JSON.parse(stored));
  //   } else {
  //     sessionStorage.setItem(
  //       "ConfiguracionSistema",
  //       JSON.stringify(CONFIGURACION_DEFAULT)
  //     );
  //     setConfiguracionState(CONFIGURACION_DEFAULT);
  //   }
  // }, []);

  const setConfiguracionEnContext = (config: ConfiguracionSistema) => {
    sessionStorage.setItem("ConfiguracionSistema", JSON.stringify(config));
    setConfiguracionState(CONFIGURACION_DEFAULT);
  };

  return (
    <ConfiguracionContext.Provider value={{ configuracion, setConfiguracionEnContext }}>
      {children}
    </ConfiguracionContext.Provider>
  );
};

// Custom hook para usar fácilmente
export const useConfiguracionSistema = () => {
  const context = useContext(ConfiguracionContext);
  if (!context) {
    throw new Error("useConfiguracionSistema debe usarse dentro de ConfiguracionSistemaProvider");
  }
  return context;
};
