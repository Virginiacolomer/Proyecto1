import { createContext, useContext, useState, ReactNode } from "react";
import { FiltrosSideBar } from "../componentes/sidebarFiltros";
import { FILTROS_INICIALES, TipoModuloFiltro } from "../config/filtros-iniciales";

interface ValoresFiltros {
  denominacion?: string;
  codigoProveedor?: string;
  codigoReferencia?: string;
  codProveedorExacto?: boolean;
  codReferenciaExacto?: boolean;
  lineaId?: number;
  denominacionLinea?: string;
  sublineaId?: number;
  denominacionSublinea?: string;
  marcaId?: number;
  denominacionMarca?: string;
  conStock?: boolean;
  fechaDesde?: string;
  fechaHasta?: string;
  clienteId?: number;
  proveedorId?: number;
  denominacionProveedor?: string;
  denominacionCliente?: string;
  condicionIvaId?: number;
  provinciaId?: number;
  familiaBancoId?: number;
  denominacionCondicionIva?: string;
  denominacionProvincia?: string;
  denominacionFamiliaBanco?: string;
  orden?: number;
  ordenCarteraCheques?: number;
  estadoAbiertoCerrado?: number;
  fechaIngresoDesde?: string;
  fechaIngresoHasta?: string;
  puntoVentaId?: number;
  importeDesde?: number;
  importeHasta?: number;
  estadoRecibo?: number;
  estadoPresupuesto?: number;
  estadoPedido?: number;
  fechaVencimientoDesde?: string;
  fechaVencimientoHasta?: string;
  numeroCheque?: string;
  estadoCarteraCheques?: number;
  estadoConfirmacionCarteraCheques?: number;
  tipoCheque?: number;
  estadoOrden?:number;
  gasto?:number;
  estadoGasto?:number;
}

export interface BuscarEnFiltros {
  cont: number;
  componente: string;
}

// Aca se pone todo lo que voy a necesitar para que se comunique la sidebar con los distintos componentes
interface FiltrosContextType {
  filtrosNecesarios: FiltrosSideBar;
  setFiltrosNecesarios: (filtros: FiltrosSideBar) => void;
  valoresFiltros: ValoresFiltros;
  setValoresFiltros: (valores: ValoresFiltros) => void;
  limpiarFiltros: () => void;

  buscar: BuscarEnFiltros;
  setBuscar: (valor: BuscarEnFiltros) => void;
  busquedaRapida: boolean;
  setBusquedaRapida: (valor: boolean) => void;
  buscarMarcas: number;
  setBuscarMarcas: (valor: number) => void;
  buscarLineas: number;
  setBuscarLineas: (valor: number) => void;

}

const FiltrosContext = createContext<FiltrosContextType | null>(null);

export const useFiltrosContext = () => {
  const ctx = useContext(FiltrosContext);
  if (!ctx) throw new Error("FiltrosContext must be used within FiltroProvider");
  return ctx;
};

export const FiltrosProvider = ({ children }: { children: ReactNode }) => {
  const [filtrosNecesarios, setFiltrosNecesarios] = useState<FiltrosSideBar>({
    denominacion: false,
    codigoProveedor: false,
    codigoReferencia: false,
    linea: false,
    sublinea: false,
    marca: false,
    conStock: false,
    fechaDesde: false,
    fechaHasta: false,
    cliente: false,
    proveedor: false,
    condicionIva: false,
    provincia: false,
    familiaBanco: false,
    orden: false,
    estadoAbiertoCerrado: false,
    fechaIngresoDesde: false,
    fechaIngresoHasta: false,
    puntoVentaId: false,
    importeDesde: false,
    importeHasta: false,
    fechaVencimientoDesde: false,
    fechaVencimientoHasta: false,
    estadoOrden:false, //agregué esta línea para ordenes de pago
  });
  const [valoresFiltros, setValoresFiltros] = useState<ValoresFiltros>({});

  
 const limpiarFiltros = () => {
  const filtrosIniciales = FILTROS_INICIALES[buscar.componente as TipoModuloFiltro];
  if (filtrosIniciales) {
    setValoresFiltros(filtrosIniciales);
  } else {
    setValoresFiltros({});
  }
};


  const [buscar, setBuscar] = useState<BuscarEnFiltros>({} as BuscarEnFiltros);
  const [busquedaRapida, setBusquedaRapida] = useState<boolean>(false);
  const [buscarMarcas, setBuscarMarcas] = useState<number>(0);
  const [buscarLineas, setBuscarLineas] = useState<number>(0);

  return (
    <FiltrosContext.Provider
      value={{
        filtrosNecesarios,
        setFiltrosNecesarios,
        valoresFiltros,
        setValoresFiltros,
        limpiarFiltros,

        buscar,
        setBuscar,
        busquedaRapida,
        setBusquedaRapida,
        buscarMarcas,
        setBuscarMarcas,
        buscarLineas,
        setBuscarLineas,
      }}
    >
      {children}
    </FiltrosContext.Provider>
  );
};
