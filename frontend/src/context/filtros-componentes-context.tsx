
import { createContext, useContext, useState, ReactNode } from "react";
import { SelectLinea } from "../interfaces/gestion-producto/linea/interfaces-linea";
import { SelectMarca } from "../interfaces/gestion-producto/marca/interfaces-marca";
import { SelectCliente } from "../interfaces/gestion-organizacion/cliente/interfaces-cliente";
import {  SelectProveedor } from "../interfaces/gestion-organizacion/proveedor/interfaces-proveedor";
import { SelectProvincia } from "../interfaces/gestion-organizacion/localidad/interfaces-localidad";
import { SelectFamiliaBanco } from "../interfaces/gestion-organizacion/banco/interfaces-banco";
import { SelectCondicionIva } from "../interfaces/gestion-organizacion/condicion-iva/interfaces-condicion-iva";

export interface ValoresFiltros {
  denominacion?: string;
  codigoProveedor?: string;
  codigoReferencia?: string;
  codProveedorExacto?: boolean;
  codReferenciaExacto?: boolean;
  lineaId?: number;
  denominacionLinea?: string;
  marcaId?: number;
  denominacionMarca?: string;
  conStock?: boolean;
  fechaDesde?: string;
  fechaHasta?: string;
  clienteId?: number;
  proveedorId?: number;
  denominacionProveedor?: string;
  denominacionCliente?: string;
  condicionIvaId?: number
  provinciaId?: number;
  familiaBancoId?: number;
  denominacionCondicionIva?: string
  denominacionProvincia?: string;
  denominacionFamiliaBanco?: string;
  orden?: number;
  estadoAbiertoCerrado?: string;

}


// Aca se pone todo lo que voy a necesitar para que se comunique la sidebar con los distintos componentes
interface FiltrosContextType {
  valoresFiltros: ValoresFiltros;
  setValoresFiltros: (valores: ValoresFiltros) => void;
  limpiarFiltros: () => void;
  lineas: SelectLinea[];
  setLineas: (lineas: SelectLinea[]) => void;
  marcas: SelectMarca[];
  setMarcas: (marcas: SelectMarca[]) => void;
  clientes: SelectCliente[];
  setClientes: (clientes: SelectCliente[]) => void;
  proveedores: SelectProveedor[],
  setProveedores: (proveedores: SelectProveedor[]) => void
  condicionesIva: SelectCondicionIva[];
  setCondicionesIva: (condicionesIva: SelectCondicionIva[]) => void;
  provincias: SelectProvincia[];
  setProvincias: (provincias: SelectProvincia[]) => void;
  familiasBanco?: SelectFamiliaBanco[];
  setFamiliasBanco?: (familias: SelectFamiliaBanco[]) => void;
  busquedaRapida: boolean;
  setBusquedaRapida: (valor: boolean) => void;
}

const FiltrosComponentesContext = createContext<FiltrosContextType | null>(null);

export const useFiltrosComponentesContext = () => {
  const ctx = useContext(FiltrosComponentesContext);
  if (!ctx) throw new Error("useFiltrosComponentesContext must be used within FiltrosComponentesProvider");
  return ctx;
};

export const FiltrosComponentesProvider = ({ children }: { children: ReactNode }) => {

  const [valoresFiltros, setValoresFiltros] = useState<ValoresFiltros>({});


    
  const limpiarFiltros = () => {
    setValoresFiltros({});
  }

  const [lineas, setLineas] = useState<SelectLinea[]>([]);
  const [marcas, setMarcas] = useState<SelectMarca[]>([]);
  const [clientes, setClientes] = useState<SelectCliente[]>([]);
  const [proveedores, setProveedores] = useState<SelectProveedor[]>([]);
  const [condicionesIva, setCondicionesIva] = useState<SelectCondicionIva[]>([]);
  const [provincias, setProvincias] = useState<SelectProvincia[]>([]);
  const [familiasBanco, setFamiliasBanco] = useState<SelectFamiliaBanco[]>([]);
  const [busquedaRapida, setBusquedaRapida] = useState<boolean>(false);

  return (
    <FiltrosComponentesContext.Provider
      value={{ 
        valoresFiltros, 
        setValoresFiltros, 
        limpiarFiltros,
        lineas,
        setLineas,
        marcas,
        setMarcas,
        clientes,
        setClientes,
        proveedores,
        setProveedores,
        condicionesIva,
        setCondicionesIva,
        provincias,
        setProvincias,
        familiasBanco,
        setFamiliasBanco,
        busquedaRapida,
        setBusquedaRapida,
    }}
    >
      {children}
    </FiltrosComponentesContext.Provider>
  );
};
