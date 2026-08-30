import { createContext, useContext, useState, ReactNode } from "react";
import { SelectLinea } from "../interfaces/gestion-producto/linea/interfaces-linea";
import { SelectSublinea } from "../interfaces/gestion-producto/sublinea/interfaces-sublinea";
import { SelectMarca } from "../interfaces/gestion-producto/marca/interfaces-marca";
import { SelectCliente } from "../interfaces/gestion-organizacion/cliente/interfaces-cliente";
import { SelectProveedor } from "../interfaces/gestion-organizacion/proveedor/interfaces-proveedor";
import { SelectCondicionIva } from "../interfaces/gestion-organizacion/condicion-iva/interfaces-condicion-iva";
import { SelectProvincia } from "../interfaces/gestion-organizacion/localidad/interfaces-localidad";
import { SelectFamiliaBanco } from "../interfaces/gestion-organizacion/banco/interfaces-banco";

interface CatalogosContextType {
  lineas: SelectLinea[];
  setLineas: (lineas: SelectLinea[]) => void;
  sublineas: SelectSublinea[];
  setSublineas: (sublineas: SelectSublinea[]) => void;
  marcas: SelectMarca[];
  setMarcas: (marcas: SelectMarca[]) => void;
  clientes: SelectCliente[];
  setClientes: (clientes: SelectCliente[]) => void;
  proveedores: SelectProveedor[];
  setProveedores: (proveedores: SelectProveedor[]) => void;
  condicionesIva: SelectCondicionIva[];
  setCondicionesIva: (condicionesIva: SelectCondicionIva[]) => void;
  provincias: SelectProvincia[];
  setProvincias: (provincias: SelectProvincia[]) => void;
  familiasBanco: SelectFamiliaBanco[];
  setFamiliasBanco: (familias: SelectFamiliaBanco[]) => void;
}

const CatalogosContext = createContext<CatalogosContextType | null>(null);

export const useCatalogosContext = () => {
  const ctx = useContext(CatalogosContext);
  if (!ctx) throw new Error("CatalogosContext must be used within CatalogosProvider");
  return ctx;
};

export const CatalogosProvider = ({ children }: { children: ReactNode }) => {
  const [lineas, setLineas] = useState<SelectLinea[]>([]);
  const [sublineas, setSublineas] = useState<SelectSublinea[]>([]);
  const [marcas, setMarcas] = useState<SelectMarca[]>([]);
  const [clientes, setClientes] = useState<SelectCliente[]>([]);
  const [proveedores, setProveedores] = useState<SelectProveedor[]>([]);
  const [condicionesIva, setCondicionesIva] = useState<SelectCondicionIva[]>([]);
  const [provincias, setProvincias] = useState<SelectProvincia[]>([]);
  const [familiasBanco, setFamiliasBanco] = useState<SelectFamiliaBanco[]>([]);

  return (
    <CatalogosContext.Provider
      value={{
        lineas,
        setLineas,
        sublineas,
        setSublineas,
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
      }}
    >
      {children}
    </CatalogosContext.Provider>
  );
};