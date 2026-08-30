import React, { createContext, useContext, useState, useCallback } from "react";
import { SelectProveedor } from "../interfaces/gestion-organizacion/proveedor/interfaces-proveedor";
import { SelectCliente } from "../interfaces/gestion-organizacion/cliente/interfaces-cliente";
import { SelectVendedor } from "../interfaces/generales/interfaces-generales";

export interface NumeroDocumento {
  prefijo: string;
  numero: string;
}

export type OptionTypeCabecera = SelectProveedor | SelectCliente;


export interface CabeceraDocumento {
  entidadId?: number;
  domicilio?: string;
  condicionIva?: string;
  letra?: string;
  letraDocumento?: string;
  fechaDocumento?: string;
  numeroDocumento?: NumeroDocumento;
  puntoVentaId?: number;
  cuit?: string;
  dni?: string;
  tipoDocumentoId?: number | null;
}

export interface CabeceraDocumentoExistente {
  entidadId: number;
  domicilio: string;
  condicionIva: string;
  letra: string;
  fechaDocumento: string;
  numeroDocumento: NumeroDocumento;
  puntoVentaId: number;
  cuit: string;
  dni: string;
  tipoDocumentoId?: number | null;
}

interface CabeceraDocumentoContextType {
  cabecera: CabeceraDocumento;
  updateCabecera: (partial: Partial<CabeceraDocumento>) => void;
  cabeceraExistente: CabeceraDocumentoExistente | null;
  setCabeceraExistente: (cabecera: CabeceraDocumentoExistente) => void;
  denominacionEntidad: string;
  setDenominacionEntidad: (denominacionEntidad: string) => void;
  mostrarFormularioEntidad: boolean;
  setMostrarFormularioEntidad: (mostrar: boolean) => void;
  entidades: OptionTypeCabecera[];
  setEntidades: (entidades: OptionTypeCabecera[]) => void;
  operador: string;
  setOperador: (operador: string) => void;
  limpiarCabecera: () => void;
  documentoGenerado: boolean;
  setDocumentoGenerado: (generado: boolean) => void;
  requiereEntidad: boolean;
  setRequiereEntidad: (requiere: boolean) => void;
  tipoDocumento: string;
  setTipoDocumento: (tipo: string) => void;
  vendedor: SelectVendedor;
  setVendedor: (vendedor: SelectVendedor) => void;
}

const CabeceraDocumentoContext = createContext<CabeceraDocumentoContextType | undefined>(undefined);

export const useCabeceraDocumento = () => {
  const context = useContext(CabeceraDocumentoContext);
  if (!context) {
    throw new Error("useCabeceraDocumento debe usarse dentro de un CabeceraDocumentoProvider");
  }
  return context;
};

export const CabeceraDocumentoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [cabecera, setCabecera] = useState<CabeceraDocumento>({} as CabeceraDocumento);
  const [cabeceraExistente, setCabeceraExistente] = useState<CabeceraDocumentoExistente | null>(null);
  const [denominacionEntidad, setDenominacionEntidad] = useState<string>("");
  const [mostrarFormularioEntidad, setMostrarFormularioEntidad] = useState(false);
  const [entidades, setEntidades] = useState<OptionTypeCabecera[]>([]);
  const [operador, setOperador] = useState<string>("");
  const [documentoGenerado, setDocumentoGenerado] = useState<boolean>(false);
  const [requiereEntidad, setRequiereEntidad] = useState<boolean>(false);
  const [tipoDocumento, setTipoDocumento] = useState<string>("");
  const [vendedor, setVendedor] = useState<SelectVendedor>({} as SelectVendedor);

  const updateCabecera = (partial: Partial<CabeceraDocumento>) => {
    setCabecera((prev) => ({
      ...(prev ?? {}), // si no había nada, arranco con objeto vacío
      ...partial,      // mergeo solo los campos que vengan
    }));
  };


  const limpiarCabecera = useCallback(() => {
    setCabecera({} as CabeceraDocumento);
    setCabeceraExistente(null);
    setDenominacionEntidad("");
    setMostrarFormularioEntidad(false);
    setEntidades([]);
    setOperador("");
    setDocumentoGenerado(false);
    setRequiereEntidad(false);
    setTipoDocumento("");
    setVendedor({} as SelectVendedor);
  }, []);

  return (
    <CabeceraDocumentoContext.Provider
      value={{
        cabecera,
        updateCabecera,
        cabeceraExistente,
        setCabeceraExistente,
        denominacionEntidad,
        setDenominacionEntidad,
        mostrarFormularioEntidad,
        setMostrarFormularioEntidad,
        entidades,
        setEntidades,
        operador,
        setOperador,
        documentoGenerado,
        setDocumentoGenerado,
        requiereEntidad,
        setRequiereEntidad,
        tipoDocumento,
        setTipoDocumento,
        vendedor,
        setVendedor,
        limpiarCabecera,
      }}
    >
      {children}
    </CabeceraDocumentoContext.Provider>
  );
};