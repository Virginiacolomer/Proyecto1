import { Search, Package, Eraser } from "lucide-react";
import Select from "react-select";
import { CardHeader, CardTitle } from "../../../../ui/Card";
import { Input } from "../../../../ui/Input";
import { Button } from "../../../../ui/Button";

type Props = { 
    valoresFiltros: any; 
    setValoresFiltros: any; 
    marcas: any[]; 
    lineas: any[]; 
    sublineas: any[]; 
    productosLength: number; 
    onBuscar: () => void; 
    fetchMarcas: () => void;
    fetchLineas: () => void;
    onLimpiarFiltros: () => void;
};

export default function FiltrosCambioPrecios({
  valoresFiltros,
  setValoresFiltros,
  marcas,
  lineas,
  sublineas,
  onBuscar,
  fetchMarcas,
  fetchLineas,
  onLimpiarFiltros
}: Props) {
  return (
    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
                {/* Filtros y estadísticas */}
                <div className="flex flex-col md:flex-row flex-wrap gap-4 w-full">
                  {/* Título */}
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="consultar-icon" />
                    <span>Productos</span>
                  </CardTitle>

                  <div className="flex items-center gap-2">
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
                              fetchMarcas();
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
                        <Select
                          value={(marcas ?? []).find((option) => option.id === valoresFiltros.marcaId) || null}
                          options={marcas ?? []}
                          getOptionLabel={(option) => option.denominacion}
                          getOptionValue={(option) => String(option.id)}
                          onChange={(option) =>
                            setValoresFiltros({
                              ...valoresFiltros,
                              marcaId: option ? option.id : undefined,
                            })
                          }
                          placeholder="Seleccione una marca"
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
                              fetchLineas();
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
                          value={(lineas ?? []).find((option) => option.id === valoresFiltros.lineaId) || null}
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

                  <div className="space-y-3 mt-14">
                    <div>
                      <Select
                        value={(sublineas ?? []).find((option) => option.id === valoresFiltros.sublineaId) || null}
                        options={sublineas ?? []}
                        getOptionLabel={(option) => option.denominacion}
                        getOptionValue={(option) => String(option.id)}
                        onChange={(option) =>
                          setValoresFiltros({
                            ...valoresFiltros,
                            sublineaId: option ? option.id : undefined,
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

                 

                  <div className="flex gap-4 items-end flex-grow">
                     <Button
                      variant="outline"
                      onClick={onBuscar}
                      className="self-end bg-blue-500 text-white hover:bg-blue-800"
                      title="Buscar Productos"
                    >
                      <Search className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="outline"
                      onClick={onLimpiarFiltros}
                      className="bg-gray-500 text-white hover:bg-gray-700"
                      title="Limpiar filtros"
                    >
                      <Eraser className="w-4 h-4" />
                    </Button>
                    {/* <PorcentajeInput
                      name="porcentaje"
                      value={porcentaje}
                      label="Porcentaje"
                      onChange={(value) => setPorcentaje(value)}
                      disabled={productosLength === 0}
                    />

                    <Button
                      variant="outline"
                      onClick={onAplicarCambios}
                      className={`self-end ${
                        productosLength === 0
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-800"
                      }`}
                      title="Aplicar Cambios"
                      disabled={productosLength === 0}
                    >
                      <Check className="w-4 h-4" />
                    </Button> */}
                  </div> 

                </div>
              </CardHeader>
  );
}