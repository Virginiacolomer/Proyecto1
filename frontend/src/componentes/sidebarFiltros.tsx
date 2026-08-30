import {
  Filter,
  Search,
  Recycle,
  Calendar,
  Truck,
  Tag,
  Building2,
  FileText,
  CheckSquare,
  MapPin,
  Landmark,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useFiltrosContext } from "../context/filtros-contesxt";
import Select from "react-select";
import { SelectContentUI, SelectItemUI, SelectTriggerUI, SelectUI, SelectValueUI } from "./ui/Select";
import { useEffect } from "react";
import { BotonVertical } from "./ui/BotonVerticalFiltros";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/Accordion";
import {

  Orden,

  PuntosVenta,
} from "../interfaces/generales/interfaces-generales";

import { useCatalogosContext } from "../context/catalogos-context";

interface SidebarProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  filtrosNecesarios: FiltrosSideBar;
}

export interface FiltrosSideBar {
  denominacion?: boolean;
  codigoProveedor?: boolean;
  codigoReferencia?: boolean;
  linea?: boolean;
  sublinea?: boolean;
  marca?: boolean;
  conStock?: boolean;
  codProveedorExacto?: boolean;
  codReferenciaExacto?: boolean;
  fechaDesde?: boolean;
  fechaHasta?: boolean;
  cliente?: boolean;
  proveedor?: boolean;
  condicionIva?: boolean;
  familiaBanco?: boolean;
  provincia?: boolean;
  orden?: boolean;

  estadoAbiertoCerrado?: boolean;
  fechaIngresoDesde?: boolean;
  fechaIngresoHasta?: boolean;
  puntoVentaId?: boolean;
  importeDesde?: boolean;
  importeHasta?: boolean;

  fechaVencimientoDesde?: boolean;
  fechaVencimientoHasta?: boolean;

  estadoOrden?: boolean;

}

export function SidebarFiltros({ isOpen, onClose, onOpen }: Omit<SidebarProps, "filtrosNecesarios">) {
  const {
    filtrosNecesarios,
    valoresFiltros,
    setValoresFiltros,
    limpiarFiltros,
    buscar,
    setBuscar,
    buscarMarcas,
    setBuscarMarcas,
    buscarLineas,
    setBuscarLineas,
  } = useFiltrosContext();

  const { lineas, sublineas, marcas, clientes, proveedores, condicionesIva, provincias, familiasBanco } =
    useCatalogosContext();

  const handleLimpiarFiltros = () => {
    limpiarFiltros();
    setBuscar({ cont: buscar.cont + 1, componente: buscar.componente });
  };

  useEffect(() => {
    console.log("Aplicando filtrossss3:", valoresFiltros);
  }, [valoresFiltros]);

  return (
    <>
      {/* Overlay para móvil */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Botón de toggle mejorado - Siempre visible */}
      <BotonVertical isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

      {/* Contenedor de la sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 320, y: 80 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 200,
              duration: 0.3,
            }}
            className="fixed top-0 right-0 bottom-0 z-40 w-80 md:z-auto"
          >
            {/* Estructura de la sidebar con altura completa */}
            <div className="h-full bg-gray-200 dark:bg-slate-900 shadow-2xl border-l border-slate-700 flex flex-col">
              {/* Header fijo */}
              <div className="flex-shrink-0 p-4 border-b border-slate-700">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-blue-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filtros</h2>
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() =>
                      setBuscar({
                        cont: buscar.cont + 1,
                        componente: buscar.componente,
                      })
                    }
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                  <Button
                    className="border-green-600 dark:border-green-900 bg-green-600"
                    onClick={handleLimpiarFiltros}
                  >
                    <Recycle className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>

              {/* Contenido scrolleable - CLAVE: usar min-h-0 para permitir shrinking */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="p-4 space-y-4">
                  <Accordion type="multiple" className="w-full space-y-2">
                    {/* Filtro Codigo */}
                    {filtrosNecesarios.codigoProveedor && (
                      <AccordionItem
                        value="codigoProveedor"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-black dark:text-white">Código</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                type="text"
                                placeholder="Codigo..."
                                name="codigoProveedor"
                                className="pl-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                                value={valoresFiltros.codigoProveedor || ""}
                                onChange={(e) =>
                                  setValoresFiltros({
                                    ...valoresFiltros,
                                    codigoProveedor: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-2 p-2.5 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-300 dark:border-slate-600">
                            <input
                              type="checkbox"
                              name="codProveedorExacto"
                              className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-blue-500"
                              checked={valoresFiltros.codProveedorExacto || false}
                              onChange={(e) =>
                                setValoresFiltros({
                                  ...valoresFiltros,
                                  codProveedorExacto: e.target.checked,
                                })
                              }
                            />
                            <label htmlFor="codProveedorExacto" className="text-sm text-gray-700 dark:text-gray-300">
                              Exacto
                            </label>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {filtrosNecesarios.codigoReferencia && (
                      <AccordionItem
                        value="codigoReferencia"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-black dark:text-white">Cod Referencia</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                type="text"
                                placeholder="Codigo Referencia..."
                                name="codigoReferencia"
                                className="pl-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                                value={valoresFiltros.codigoReferencia || ""}
                                onChange={(e) =>
                                  setValoresFiltros({
                                    ...valoresFiltros,
                                    codigoReferencia: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-2 p-2.5 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-300 dark:border-slate-600">
                            <input
                              type="checkbox"
                              name="codReferenciaExacto"
                              className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-blue-500"
                              checked={valoresFiltros.codReferenciaExacto || false}
                              onChange={(e) =>
                                setValoresFiltros({
                                  ...valoresFiltros,
                                  codReferenciaExacto: e.target.checked,
                                })
                              }
                            />
                            <label htmlFor="codReferenciaExacto" className="text-sm text-gray-700 dark:text-gray-300">
                              Exacto
                            </label>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Filtro Denominación */}
                    {filtrosNecesarios.denominacion && (
                      <AccordionItem
                        value="denominacion"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Denominación</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                type="text"
                                placeholder="Denominación..."
                                name="denominacion"
                                className="pl-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                                value={valoresFiltros.denominacion || ""}
                                onChange={(e) =>
                                  setValoresFiltros({
                                    ...valoresFiltros,
                                    denominacion: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {filtrosNecesarios.numeroCheque && (
                      <AccordionItem
                        value="numeroCheque"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Número de Cheque
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                type="text"
                                placeholder="Número de Cheque..."
                                name="numeroCheque"
                                className="pl-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                                value={valoresFiltros.numeroCheque || ""}
                                onChange={(e) =>
                                  setValoresFiltros({
                                    ...valoresFiltros,
                                    numeroCheque: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Filtro Línea */}
                    {filtrosNecesarios.linea && (
                      <AccordionItem value="linea" className="border border-gray-200 dark:border-slate-600 rounded-lg">
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Línea</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                              <div className="space-y-3">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input
                                    type="text"
                                    placeholder="Denominación..."
                                    className="pl-10 bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 focus:border-blue-500 focus:ring-blue-500"
                                    value={valoresFiltros.denominacionLinea ?? ""}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        setBuscarLineas(buscarLineas + 1);
                                      }
                                    }}
                                    onChange={(e) =>
                                      setValoresFiltros({
                                        ...valoresFiltros,
                                        denominacionLinea: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <Select
                                    value={
                                      (lineas ?? []).find((option) => option.id === valoresFiltros.lineaId) || null
                                    }
                                    options={lineas ?? []}
                                    getOptionLabel={(option) => option.denominacion}
                                    getOptionValue={(option) => String(option.id)}
                                    onChange={(option) =>
                                      setValoresFiltros({
                                        ...valoresFiltros,
                                        lineaId: option ? option.id : undefined,
                                      })
                                    }
                                    placeholder="Seleccione una linea"
                                    className="text-black"
                                    menuPortalTarget={document.body}
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        color: "black",
                                      }),
                                      singleValue: (base) => ({
                                        ...base,
                                        color: "black",
                                      }),
                                      option: (base, { isSelected, isFocused }) => ({
                                        ...base,
                                        color: isSelected ? "white" : "black",
                                        backgroundColor: isSelected ? "#3b82f6" : isFocused ? "#93c5fd" : "white",
                                      }),
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Filtro Subínea */}
                    {filtrosNecesarios.sublinea && (
                      <AccordionItem
                        value="sublinea"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sublínea</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                              <div className="space-y-3">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input
                                    type="text"
                                    placeholder="Denominación..."
                                    className="pl-10 bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 focus:border-blue-500 focus:ring-blue-500"
                                    value={valoresFiltros.denominacionSublinea ?? ""}
                                    onChange={(e) =>
                                      setValoresFiltros({
                                        ...valoresFiltros,
                                        denominacionSublinea: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <Select
                                    value={
                                      (sublineas ?? []).find((option) => option.id === valoresFiltros.sublineaId) ||
                                      null
                                    }
                                    options={sublineas ?? []}
                                    getOptionLabel={(option) => option.denominacion}
                                    getOptionValue={(option) => String(option.id)}
                                    onChange={(option) =>
                                      setValoresFiltros({
                                        ...valoresFiltros,
                                        lineaId: option ? option.id : undefined,
                                      })
                                    }
                                    placeholder="Seleccione una sublínea"
                                    className="text-black"
                                    menuPortalTarget={document.body}
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        color: "black",
                                      }),
                                      singleValue: (base) => ({
                                        ...base,
                                        color: "black",
                                      }),
                                      option: (base, { isSelected, isFocused }) => ({
                                        ...base,
                                        color: isSelected ? "white" : "black",
                                        backgroundColor: isSelected ? "#3b82f6" : isFocused ? "#93c5fd" : "white",
                                      }),
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Filtro Marca */}
                    {filtrosNecesarios.marca && (
                      <AccordionItem value="marca" className="border border-gray-200 dark:border-slate-600 rounded-lg">
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Marca</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                              <div className="space-y-3">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input
                                    type="text"
                                    placeholder="Denominación..."
                                    className="pl-10 bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 focus:border-blue-500 focus:ring-blue-500"
                                    value={valoresFiltros.denominacionMarca}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        setBuscarMarcas(buscarMarcas + 1);
                                      }
                                    }}
                                    onChange={(e) =>
                                      setValoresFiltros({
                                        ...valoresFiltros,
                                        denominacionMarca: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <SelectUI
                                    onValueChange={(value) =>
                                      setValoresFiltros({
                                        ...valoresFiltros,
                                        marcaId: Number(value),
                                      })
                                    }
                                  >
                                    <SelectTriggerUI className="w-[200px] bg-white text-black">
                                      <SelectValueUI placeholder="Seleccione una marca" />
                                    </SelectTriggerUI>
                                    <SelectContentUI className="bg-white text-black">
                                      {(marcas ?? []).map((marca) => (
                                        <SelectItemUI
                                          key={marca.id}
                                          value={String(marca.id)}
                                          className="
                                            data-[state=checked]:bg-blue-500 
                                            data-[state=checked]:text-white
                                            data-[highlighted]:bg-blue-200 
                                            data-[highlighted]:text-black
                                          "
                                        >
                                          {marca.denominacion}
                                        </SelectItemUI>
                                      ))}
                                    </SelectContentUI>
                                  </SelectUI>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Filtro Proveedor */}
                    {filtrosNecesarios.proveedor && (
                      <AccordionItem
                        value="proveedor"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Proveedor</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                              <div className="space-y-3">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input
                                    type="text"
                                    placeholder="Denominación..."
                                    className="pl-10 bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 focus:border-blue-500 focus:ring-blue-500"
                                    value={valoresFiltros.denominacionProveedor}
                                    onChange={(e) =>
                                      setValoresFiltros({
                                        ...valoresFiltros,
                                        denominacionProveedor: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <Select
                                    value={
                                      (proveedores ?? []).find((option) => option.id === valoresFiltros.proveedorId) ||
                                      null
                                    }
                                    options={proveedores ?? []}
                                    getOptionLabel={(option) => option.denominacion}
                                    getOptionValue={(option) => String(option.id)}
                                    onChange={(option) =>
                                      setValoresFiltros({
                                        ...valoresFiltros,
                                        proveedorId: option ? option.id : undefined,
                                      })
                                    }
                                    placeholder="Seleccione un proveedor"
                                    className="text-black"
                                    menuPortalTarget={document.body}
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        color: "black",
                                      }),
                                      singleValue: (base) => ({
                                        ...base,
                                        color: "black",
                                      }),
                                      option: (base, { isSelected, isFocused }) => ({
                                        ...base,
                                        color: isSelected ? "white" : "black",
                                        backgroundColor: isSelected ? "#3b82f6" : isFocused ? "#93c5fd" : "white",
                                      }),
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Filtro Con Stock */}
                    {(filtrosNecesarios.conStock || filtrosNecesarios.codigoReferencia) && (
                      <AccordionItem
                        value="conStock"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Filtros Adicionales
                            </span>
                          </div>
                        </AccordionTrigger>

                        {filtrosNecesarios.conStock && (
                          <AccordionContent className="px-4 pb-4">
                            <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                              <div className="flex items-center space-x-2 p-2.5 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-300 dark:border-slate-600">
                                <input
                                  type="checkbox"
                                  name="conStock"
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  checked={valoresFiltros.conStock || false}
                                  onChange={(e) =>
                                    setValoresFiltros({
                                      ...valoresFiltros,
                                      conStock: e.target.checked,
                                    })
                                  }
                                />
                                <label htmlFor="conStock" className="text-sm text-gray-700 dark:text-gray-300">
                                  Solo con stock
                                </label>
                              </div>
                            </div>
                          </AccordionContent>
                        )}
                      </AccordionItem>
                    )}

                    {/* Filtro Fecha Desde */}
                    {filtrosNecesarios.fechaDesde && (
                      <AccordionItem
                        value="fechaDesde"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha Desde</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                type="date"
                                name="fechaDesde"
                                className="pl-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                                value={valoresFiltros.fechaDesde}
                                onChange={(e) =>
                                  setValoresFiltros({
                                    ...valoresFiltros,
                                    fechaDesde: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Filtro Fecha Hasta */}
                    {filtrosNecesarios.fechaHasta && (
                      <AccordionItem
                        value="fechaHasta"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha Hasta</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                type="date"
                                name="fechaHasta"
                                className="pl-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                                value={valoresFiltros.fechaHasta}
                                onChange={(e) =>
                                  setValoresFiltros({
                                    ...valoresFiltros,
                                    fechaHasta: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Filtro Fecha Desde */}
                    {filtrosNecesarios.fechaIngresoDesde && (
                      <AccordionItem
                        value="fechaIngresoDesde"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Fecha Ingreso Desde
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                type="date"
                                name="fechaIngresoDesde"
                                className="pl-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                                value={valoresFiltros.fechaIngresoDesde}
                                onChange={(e) =>
                                  setValoresFiltros({
                                    ...valoresFiltros,
                                    fechaIngresoDesde: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Filtro Fecha Hasta */}
                    {filtrosNecesarios.fechaIngresoHasta && (
                      <AccordionItem
                        value="fechaIngresoHasta"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Fecha Ingreso Hasta
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                type="date"
                                name="fechaIngresoHasta"
                                className="pl-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                                value={valoresFiltros.fechaIngresoHasta}
                                onChange={(e) =>
                                  setValoresFiltros({
                                    ...valoresFiltros,
                                    fechaIngresoHasta: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {filtrosNecesarios.fechaVencimientoDesde && (
                      <AccordionItem
                        value="fechaVencimientoDesde"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Fecha Vencimiento Desde
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                type="date"
                                name="fechaVencimientoDesde"
                                className="pl-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                                value={valoresFiltros.fechaVencimientoDesde}
                                onChange={(e) =>
                                  setValoresFiltros({
                                    ...valoresFiltros,
                                    fechaVencimientoDesde: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Filtro Fecha Hasta */}
                    {filtrosNecesarios.fechaVencimientoHasta && (
                      <AccordionItem
                        value="fechaVencimientoHasta"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Fecha Vencimiento Hasta
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                type="date"
                                name="fechaVencimientoHasta"
                                className="pl-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                                value={valoresFiltros.fechaVencimientoHasta}
                                onChange={(e) =>
                                  setValoresFiltros({
                                    ...valoresFiltros,
                                    fechaVencimientoHasta: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {filtrosNecesarios.importeDesde && (
                      <AccordionItem
                        value="importeDesde"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Importe Desde</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <input
                              type="text"
                              className="pl-2 py-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 rounded w-full"
                              value={valoresFiltros.importeDesde}
                              onChange={(e) =>
                                setValoresFiltros({
                                  ...valoresFiltros,
                                  importeDesde: Number(e.target.value),
                                })
                              }
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {filtrosNecesarios.importeHasta && (
                      <AccordionItem
                        value="importeHasta"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Importe Hasta</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <input
                              type="text"
                              className="pl-2 py-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 rounded w-full"
                              value={valoresFiltros.importeHasta}
                              onChange={(e) =>
                                setValoresFiltros({
                                  ...valoresFiltros,
                                  importeHasta: Number(e.target.value),
                                })
                              }
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {filtrosNecesarios.puntoVentaId && (
                      <AccordionItem
                        value="puntoVentaId"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Punto de Venta</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                              <div className="space-y-3">
                                <div>
                                  <SelectUI
                                    value={
                                      valoresFiltros.puntoVentaId !== undefined
                                        ? String(valoresFiltros.puntoVentaId)
                                        : undefined
                                    }
                                    onValueChange={(value) =>
                                      setValoresFiltros({
                                        ...valoresFiltros,
                                        puntoVentaId: value === undefined ? undefined : Number(value),
                                      })
                                    }
                                  >
                                    <SelectTriggerUI className="w-full px-3 py-2 rounded-lg border border-gray-300 text-black bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                      <SelectValueUI placeholder="Seleccione un punto de venta" />
                                    </SelectTriggerUI>

                                    <SelectContentUI className="bg-white text-black">
                                      {Object.entries(PuntosVenta).map(([key, value]) => (
                                        <SelectItemUI
                                          key={value}
                                          value={String(value)} // 👈 SIEMPRE string
                                          className="
                                            data-[state=checked]:bg-blue-500 
                                            data-[state=checked]:text-white
                                            data-[highlighted]:bg-blue-200 
                                            data-[highlighted]:text-black
                                          "
                                        >
                                          {key}
                                        </SelectItemUI>
                                      ))}
                                    </SelectContentUI>
                                  </SelectUI>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Filtro Cliente */}
                    {filtrosNecesarios.cliente && (
                      <AccordionItem
                        value="cliente"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cliente</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                              <div className="space-y-3">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input
                                    type="text"
                                    placeholder="Denominación..."
                                    className="pl-10 bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 focus:border-blue-500 focus:ring-blue-500"
                                    value={valoresFiltros.denominacionCliente}
                                    onChange={(e) =>
                                      setValoresFiltros({
                                        ...valoresFiltros,
                                        denominacionCliente: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <Select
                                    value={
                                      (clientes ?? []).find((option) => option.id === valoresFiltros.clienteId) || null
                                    }
                                    options={clientes ?? []}
                                    getOptionLabel={(option) => option.denominacion}
                                    getOptionValue={(option) => String(option.id)}
                                    onChange={(option) =>
                                      setValoresFiltros({
                                        ...valoresFiltros,
                                        clienteId: option ? option.id : undefined,
                                      })
                                    }
                                    placeholder="Seleccione un cliente"
                                    className="text-black"
                                    menuPortalTarget={document.body}
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        color: "black",
                                      }),
                                      singleValue: (base) => ({
                                        ...base,
                                        color: "black",
                                      }),
                                      option: (base, { isSelected, isFocused }) => ({
                                        ...base,
                                        color: isSelected ? "white" : "black",
                                        backgroundColor: isSelected ? "#3b82f6" : isFocused ? "#93c5fd" : "white",
                                      }),
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Filtro Condición IVA */}
                    {filtrosNecesarios.condicionIva && (
                      <AccordionItem
                        value="condicionIva"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Condición IVA</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                              <div className="space-y-3">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input
                                    type="text"
                                    placeholder="Denominación..."
                                    className="pl-10 bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 focus:border-blue-500 focus:ring-blue-500"
                                    value={valoresFiltros.denominacionCondicionIva}
                                    onChange={(e) =>
                                      setValoresFiltros({
                                        ...valoresFiltros,
                                        denominacionCondicionIva: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <Select
                                    value={
                                      (condicionesIva ?? []).find(
                                        (option) => option.id === valoresFiltros.condicionIvaId
                                      ) || null
                                    }
                                    options={condicionesIva ?? []}
                                    getOptionLabel={(option) => option.denominacion}
                                    getOptionValue={(option) => String(option.id)}
                                    onChange={(option) =>
                                      setValoresFiltros({
                                        ...valoresFiltros,
                                        condicionIvaId: option ? option.id : undefined,
                                      })
                                    }
                                    placeholder="Seleccione condicion iva"
                                    className="text-black"
                                    menuPortalTarget={document.body}
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        color: "black",
                                      }),
                                      singleValue: (base) => ({
                                        ...base,
                                        color: "black",
                                      }),
                                      option: (base, { isSelected, isFocused }) => ({
                                        ...base,
                                        color: isSelected ? "white" : "black",
                                        backgroundColor: isSelected ? "#3b82f6" : isFocused ? "#93c5fd" : "white",
                                      }),
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Filtro Provincia */}
                    {filtrosNecesarios.provincia && (
                      <AccordionItem
                        value="provincia"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Provincia</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                              <div className="space-y-3">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input
                                    type="text"
                                    placeholder="Denominación..."
                                    className="pl-10 bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 focus:border-blue-500 focus:ring-blue-500"
                                    value={valoresFiltros.denominacionProvincia}
                                    onChange={(e) =>
                                      setValoresFiltros({
                                        ...valoresFiltros,
                                        denominacionProvincia: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <Select
                                    value={
                                      (provincias ?? []).find((option) => option.id === valoresFiltros.provinciaId) ||
                                      null
                                    }
                                    options={provincias ?? []}
                                    getOptionLabel={(option) => option.denominacion}
                                    getOptionValue={(option) => String(option.id)}
                                    onChange={(option) =>
                                      setValoresFiltros({
                                        ...valoresFiltros,
                                        provinciaId: option ? option.id : undefined,
                                      })
                                    }
                                    placeholder="Seleccione provincia"
                                    className="text-black"
                                    menuPortalTarget={document.body}
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        color: "black",
                                      }),
                                      singleValue: (base) => ({
                                        ...base,
                                        color: "black",
                                      }),
                                      option: (base, { isSelected, isFocused }) => ({
                                        ...base,
                                        color: isSelected ? "white" : "black",
                                        backgroundColor: isSelected ? "#3b82f6" : isFocused ? "#93c5fd" : "white",
                                      }),
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Filtro Familia Banco */}
                    {filtrosNecesarios.familiaBanco && (
                      <AccordionItem
                        value="familiaBanco"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Landmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Familia Banco</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                              <div className="space-y-3">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input
                                    type="text"
                                    placeholder="Denominación..."
                                    className="pl-10 bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 focus:border-blue-500 focus:ring-blue-500"
                                    value={valoresFiltros.denominacionFamiliaBanco}
                                    onChange={(e) =>
                                      setValoresFiltros({
                                        ...valoresFiltros,
                                        denominacionFamiliaBanco: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <Select
                                    value={
                                      (familiasBanco ?? []).find(
                                        (option) => option.id === valoresFiltros.familiaBancoId
                                      ) || null
                                    }
                                    options={familiasBanco ?? []}
                                    getOptionLabel={(option) => option.denominacion}
                                    getOptionValue={(option) => String(option.id)}
                                    onChange={(option) =>
                                      setValoresFiltros({
                                        ...valoresFiltros,
                                        familiaBancoId: option ? option.id : undefined,
                                      })
                                    }
                                    placeholder="Seleccione familia de banco"
                                    className="text-black"
                                    menuPortalTarget={document.body}
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        color: "black",
                                      }),
                                      singleValue: (base) => ({
                                        ...base,
                                        color: "black",
                                      }),
                                      option: (base, { isSelected, isFocused }) => ({
                                        ...base,
                                        color: isSelected ? "white" : "black",
                                        backgroundColor: isSelected ? "#3b82f6" : isFocused ? "#93c5fd" : "white",
                                      }),
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Filtro Estado Abierto Cerrado */}
                    {filtrosNecesarios.estadoAbiertoCerrado && (
                      <AccordionItem
                        value="estadoAbiertoCerrado"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Landmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                              <div className="space-y-3">
                                <div>
                                  <SelectUI
                                    value={
                                      valoresFiltros.estadoAbiertoCerrado !== undefined
                                        ? valoresFiltros.estadoAbiertoCerrado
                                        : undefined
                                    }
                                    onValueChange={(value) =>
                                      setValoresFiltros({
                                        ...valoresFiltros,
                                        estadoAbiertoCerrado: value === undefined ? undefined : value,
                                      })
                                    }
                                  >
                                    <SelectTriggerUI className="w-full px-3 py-2 rounded-lg border border-gray-300 text-black bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                      <SelectValueUI placeholder="Seleccione un estado" />
                                    </SelectTriggerUI>

                                    <SelectContentUI className="bg-white text-black">
                                      {Object.entries(CondicionesCerrado).map(([key, value]) => (
                                        <SelectItemUI
                                          key={value}
                                          value={String(value)} // 👈 SIEMPRE string
                                          className="
                                            data-[state=checked]:bg-blue-500 
                                            data-[state=checked]:text-white
                                            data-[highlighted]:bg-blue-200 
                                            data-[highlighted]:text-black
                                          "
                                        >
                                          {key}
                                        </SelectItemUI>
                                      ))}
                                    </SelectContentUI>
                                  </SelectUI>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {filtrosNecesarios.estadoRecibo && (
                      <AccordionItem
                        value="estadoRecibo"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Landmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 overflow-visible">
                          <div className="space-y-3">
                            <div className="mt-2">
                              <SelectUI
                                value={
                                  valoresFiltros.estadoRecibo !== undefined
                                    ? String(valoresFiltros.estadoRecibo)
                                    : undefined
                                }
                                onValueChange={(value) =>
                                  setValoresFiltros({
                                    ...valoresFiltros,
                                    estadoRecibo: value === undefined ? undefined : Number(value),
                                  })
                                }
                              >
                                <SelectTriggerUI className="w-full px-3 py-2 rounded-lg border border-gray-300 text-black bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                  <SelectValueUI placeholder="Seleccione un estado" />
                                </SelectTriggerUI>

                                <SelectContentUI className="bg-white text-black">
                                  {Object.entries(EstadoRecibo).map(([key, value]) => (
                                    <SelectItemUI
                                      key={key}
                                      value={key} // 👈 SIEMPRE string
                                      className="
                                    data-[state=checked]:bg-blue-500 
                                    data-[state=checked]:text-white
                                    data-[highlighted]:bg-blue-200 
                                    data-[highlighted]:text-black
                                  "
                                    >
                                      {value}
                                    </SelectItemUI>
                                  ))}
                                </SelectContentUI>
                              </SelectUI>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {filtrosNecesarios.estadoPresupuesto && (
                      <AccordionItem
                        value="estadoPresupuesto"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Landmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 overflow-visible">
                          <div className="space-y-3">
                            <div className="mt-2">
                              <SelectUI
                                value={
                                  valoresFiltros.estadoPresupuesto !== undefined
                                    ? String(valoresFiltros.estadoPresupuesto)
                                    : undefined
                                }
                                onValueChange={(value) =>
                                  setValoresFiltros({
                                    ...valoresFiltros,
                                    estadoPresupuesto: value === undefined ? undefined : Number(value),
                                  })
                                }
                              >
                                <SelectTriggerUI className="w-full px-3 py-2 rounded-lg border border-gray-300 text-black bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                  <SelectValueUI placeholder="Seleccione un estado" />
                                </SelectTriggerUI>

                                <SelectContentUI className="bg-white text-black">
                                  {Object.entries(EstadoPresupuestoN).map(([key, value]) => (
                                    <SelectItemUI
                                      key={value}
                                      value={String(value)} // 👈 SIEMPRE string
                                      className="
                                    data-[state=checked]:bg-blue-500 
                                    data-[state=checked]:text-white
                                    data-[highlighted]:bg-blue-200 
                                    data-[highlighted]:text-black
                                  "
                                    >
                                      {key}
                                    </SelectItemUI>
                                  ))}
                                </SelectContentUI>
                              </SelectUI>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {filtrosNecesarios.estadoPedido && (
                      <AccordionItem
                        value="estadoPedido"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Landmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 overflow-visible">
                          <div className="space-y-3">
                            <div className="mt-2">
                              <SelectUI
                                value={
                                  valoresFiltros.estadoPedido !== undefined
                                    ? String(valoresFiltros.estadoPedido)
                                    : undefined
                                }
                                onValueChange={(value) =>
                                  setValoresFiltros({
                                    ...valoresFiltros,
                                    estadoPedido: value === undefined ? undefined : Number(value),
                                  })
                                }
                              >
                                <SelectTriggerUI className="w-full px-3 py-2 rounded-lg border border-gray-300 text-black bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                  <SelectValueUI placeholder="Seleccione un estado" />
                                </SelectTriggerUI>

                                <SelectContentUI className="bg-white text-black">
                                  {Object.entries(EstadosPedidoVentaBusqueda).map(([key, value]) => (
                                    <SelectItemUI
                                      key={key}
                                      value={key} // 👈 SIEMPRE string
                                      className="
                                          data-[state=checked]:bg-blue-500 
                                          data-[state=checked]:text-white
                                          data-[highlighted]:bg-blue-200 
                                          data-[highlighted]:text-black
                                        "
                                    >
                                      {value}
                                    </SelectItemUI>
                                  ))}
                                </SelectContentUI>
                              </SelectUI>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {filtrosNecesarios.estadoCarteraCheques && (
                      <AccordionItem
                        value="estadoCarteraCheques"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Landmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 overflow-visible">
                          <div className="space-y-3">
                            <div className="mt-2">
                              <SelectUI
                                value={
                                  valoresFiltros.estadoCarteraCheques !== undefined
                                    ? String(valoresFiltros.estadoCarteraCheques)
                                    : undefined
                                }
                                onValueChange={(value) =>
                                  setValoresFiltros({
                                    ...valoresFiltros,
                                    estadoCarteraCheques: value === undefined ? undefined : Number(value),
                                  })
                                }
                              >
                                <SelectTriggerUI className="w-full px-3 py-2 rounded-lg border border-gray-300 text-black bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                  <SelectValueUI placeholder="Seleccione un estado" />
                                </SelectTriggerUI>

                                <SelectContentUI className="bg-white text-black">
                                  {Object.entries(EstadoCarteraCheques).map(([key, value]) => (
                                    <SelectItemUI
                                      key={key}
                                      value={key} // 👈 SIEMPRE string
                                      className="
                                    data-[state=checked]:bg-blue-500 
                                    data-[state=checked]:text-white
                                    data-[highlighted]:bg-blue-200 
                                    data-[highlighted]:text-black
                                  "
                                    >
                                      {value}
                                    </SelectItemUI>
                                  ))}
                                </SelectContentUI>
                              </SelectUI>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {filtrosNecesarios.estadoConfirmacionCarteraCheques && (
                      <AccordionItem
                        value="estadoConfirmacionCarteraCheques"
                        className="border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <Landmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 overflow-visible">
                          <div className="space-y-3">
                            <div className="mt-2">
                              <SelectUI
                                value={
                                  valoresFiltros.estadoConfirmacionCarteraCheques !== undefined
                                    ? String(valoresFiltros.estadoConfirmacionCarteraCheques)
                                    : undefined
                                }
                                onValueChange={(value) =>
                                  setValoresFiltros({
                                    ...valoresFiltros,
                                    estadoConfirmacionCarteraCheques: value === undefined ? undefined : Number(value),
                                  })
                                }
                              >
                                <SelectTriggerUI className="w-full px-3 py-2 rounded-lg border border-gray-300 text-black bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                  <SelectValueUI placeholder="Seleccione un estado" />
                                </SelectTriggerUI>

                                <SelectContentUI className="bg-white text-black">
                                  {Object.entries(EstadoConfirmacionCarteraCheques).map(([key, value]) => (
                                    <SelectItemUI
                                      key={key}
                                      value={key} // 👈 SIEMPRE string
                                      className="
                                    data-[state=checked]:bg-blue-500 
                                    data-[state=checked]:text-white
                                    data-[highlighted]:bg-blue-200 
                                    data-[highlighted]:text-black
                                  "
                                    >
                                      {value}
                                    </SelectItemUI>
                                  ))}
                                </SelectContentUI>
                              </SelectUI>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* FILTROS DE ORDENAMIENTO */}
                    {filtrosNecesarios.orden ||
                      (filtrosNecesarios.ordenCarteraCheques && (
                        <>
                          <hr className="my-2 border-gray-300" />
                          <div className="flex items-center space-x-3 p-1">
                            <Landmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Filtros de Ordenamiento
                            </span>
                          </div>
                          <hr className="my-2 border-gray-300" />

                          {filtrosNecesarios.orden && (
                            <AccordionItem
                              value="orden"
                              className="border border-gray-200 dark:border-slate-600 rounded-lg"
                            >
                              <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                                <div className="flex items-center space-x-3">
                                  <Landmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Orden</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-4 overflow-visible">
                                <div className="space-y-3">
                                  <div className="mt-2">
                                    <SelectUI
                                      value={
                                        valoresFiltros.orden !== undefined ? String(valoresFiltros.orden) : undefined
                                      }
                                      onValueChange={(value) =>
                                        setValoresFiltros({
                                          ...valoresFiltros,
                                          orden: value === undefined ? undefined : Number(value),
                                        })
                                      }
                                    >
                                      <SelectTriggerUI className="w-full px-3 py-2 rounded-lg border border-gray-300 text-black bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <SelectValueUI placeholder="Seleccione un orden" />
                                      </SelectTriggerUI>

                                      <SelectContentUI className="bg-white text-black">
                                        {Object.entries(Orden).map(([key, value]) => (
                                          <SelectItemUI
                                            key={value}
                                            value={String(value)} // 👈 SIEMPRE string
                                            className="
                                        data-[state=checked]:bg-blue-500 
                                        data-[state=checked]:text-white
                                        data-[highlighted]:bg-blue-200 
                                        data-[highlighted]:text-black
                                      "
                                          >
                                            {key}
                                          </SelectItemUI>
                                        ))}
                                      </SelectContentUI>
                                    </SelectUI>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )}

                          {filtrosNecesarios.ordenCarteraCheques && (
                            <AccordionItem
                              value="ordenCarteraCheques"
                              className="border border-gray-200 dark:border-slate-600 rounded-lg"
                            >
                              <AccordionTrigger className="bg-gray-400 dark:bg-gray-700 px-4 py-3 hover:no-underline">
                                <div className="flex items-center space-x-3">
                                  <Landmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Ordenamiento por:
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-4 overflow-visible">
                                <div className="space-y-3">
                                  <div className="mt-2">
                                    <SelectUI
                                      value={
                                        valoresFiltros.ordenCarteraCheques !== undefined
                                          ? String(valoresFiltros.ordenCarteraCheques)
                                          : undefined
                                      }
                                      onValueChange={(value) =>
                                        setValoresFiltros({
                                          ...valoresFiltros,
                                          ordenCarteraCheques: value === undefined ? undefined : Number(value),
                                        })
                                      }
                                    >
                                      <SelectTriggerUI className="w-full px-3 py-2 rounded-lg border border-gray-300 text-black bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <SelectValueUI placeholder="Seleccione un orden" />
                                      </SelectTriggerUI>

                                      <SelectContentUI className="bg-white text-black">
                                        {Object.entries(OrdenCarteraCheques).map(([key, value]) => (
                                          <SelectItemUI
                                            key={key}
                                            value={key} // 👈 SIEMPRE string
                                            className="
                                        data-[state=checked]:bg-blue-500 
                                        data-[state=checked]:text-white
                                        data-[highlighted]:bg-blue-200 
                                        data-[highlighted]:text-black
                                      "
                                          >
                                            {value}
                                          </SelectItemUI>
                                        ))}
                                      </SelectContentUI>
                                    </SelectUI>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )}
                        </>
                      ))}
                  </Accordion>

                  {/* Espaciado adicional al final para asegurar que el último elemento sea visible */}
                  <div className="h-4"></div>
                </div>
              </div>

              {/* Footer fijo */}
              <div className="flex-shrink-0 p-4 border-t border-slate-700">
                <div className="text-center">
                  <p className="text-xs text-gray-500">© 2025</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
