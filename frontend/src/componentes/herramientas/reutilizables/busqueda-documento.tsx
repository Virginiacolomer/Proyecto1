import { useState } from "react";
import { Button } from "../../ui/Button";
import { Card, CardContent, CardFooter } from "../../ui/Card";
import Select from "react-select";
import { Column, TablaAGGrid } from "../tablas/tabla-flexible-ag-grid";
import { DocumentoSeleccionado } from "../../../interfaces/generales/interfaces-generales";
import { getOneMonthAgoDate, getTodayDate } from "../funciones-reutilizables/funcion-fechas-mes-antes";
import { formatPrice, formatDate } from "../formateo-de-campos/fucion-formateo";
import EncabezadoFormularios from "../../ui/encabezadoFormularios";
import { CheckCircle, FileSearch, Search } from "lucide-react";

// Filtros que se pasan al onBuscar
export interface FiltrosBusquedaDocumento {
  fechaDesde: string;
  fechaHasta: string;
  tipoDocumento?: number;
}

// Opción para el select de tipo de documento
export interface OpcionTipoDocumento {
  id: number;
  denominacion: string;
}

interface BuscarDocumentoProps {
  subtitulo?: string;
  tiposDocumento?: OpcionTipoDocumento[];          // si no se pasa, no muestra el select
  tipoDocumentoInicial?: number;
  onBuscar: (filtros: FiltrosBusquedaDocumento) => Promise<DocumentoSeleccionado[]>;
  onSeleccionar: (documento: DocumentoSeleccionado) => void;
  onCerrar: () => void;
}

export default function BuscarDocumento({
  subtitulo,
  tiposDocumento,
  tipoDocumentoInicial,
  onBuscar,
  onSeleccionar,
  onCerrar,
}: BuscarDocumentoProps) {
  const [documentos, setDocumentos] = useState<DocumentoSeleccionado[]>([]);
  const [filtros, setFiltros] = useState<FiltrosBusquedaDocumento>({
    fechaDesde: getOneMonthAgoDate(),
    fechaHasta: getTodayDate(),
    tipoDocumento: tipoDocumentoInicial,
  });

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleBuscar = async () => {
    const resultado = await onBuscar(filtros);
    setDocumentos(resultado);
  };

  const columns: Column<DocumentoSeleccionado>[] = [
    {
      header: "Fecha",
      accessor: "fechaDocumento",
      flex: 1,
      type: "text",
      editable: false,
      formatFunction: ({ value }) => <span>{formatDate(value as string)}</span>,
    },
    {
      header: "Documento",
      accessor: "numeroDocumentoCompleto",
      flex: 2,
      type: "text",
      editable: false,
    },
    {
      header: "Importe",
      accessor: "importeTotal",
      flex: 0.7,
      type: "text",
      align: "right",
      editable: false,
      formatFunction: ({ value }) => <span>{formatPrice(value || 0, "ARS")}</span>,
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto py-5">
      <Card className="w-full max-w-4xl bg-white mx-auto shadow-lg rounded-2xl overflow-hidden">
        <EncabezadoFormularios
          title="Búsqueda de Documentos"
          subtitle={subtitulo}
          icon={<FileSearch className="form-icon" />}
          onClose={onCerrar}
        />

        <CardContent className="space-y-4 px-4 py-4">
          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
            <div className="space-y-1">
              <label className="text-sm font-medium">Desde</label>
              <input
                type="date"
                name="fechaDesde"
                value={filtros.fechaDesde}
                onChange={handleFiltroChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Hasta</label>
              <input
                type="date"
                name="fechaHasta"
                value={filtros.fechaHasta}
                onChange={handleFiltroChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {tiposDocumento && tiposDocumento.length > 0 ? (
              <div className="space-y-1">
                <label className="text-sm font-medium">Tipo de documento</label>
                <Select
                  value={tiposDocumento.find((o) => o.id === filtros.tipoDocumento) || null}
                  options={tiposDocumento}
                  getOptionLabel={(o) => o.denominacion}
                  getOptionValue={(o) => String(o.id)}
                  onChange={(selected) =>
                    setFiltros({ ...filtros, tipoDocumento: selected ? selected.id : undefined })
                  }
                  className="text-sm"
                  menuPortalTarget={document.body}
                  styles={{
                    control: (base) => ({ ...base, borderColor: "#d1d5db", borderRadius: "0.375rem" }),
                    singleValue: (base) => ({ ...base, color: "black" }),
                    option: (base, { isSelected, isFocused }) => ({
                      ...base,
                      color: isSelected ? "white" : "black",
                      backgroundColor: isSelected ? "#3b82f6" : isFocused ? "#93c5fd" : "white",
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </div>
            ) : (
              <div /> // placeholder para mantener el grid de 4 columnas
            )}

            <Button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white w-full"
              onClick={handleBuscar}
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>

          {/* Tabla */}
          <TablaAGGrid
            columns={columns}
            data={documentos}
            onUpdate={() => {}}
            actions={(row) => (
              <Button
                type="button"
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white w-8 h-8"
                onClick={() => onSeleccionar(row)}
                title="Seleccionar"
              >
                <CheckCircle size={16} />
              </Button>
            )}
            actionsFlex={0.5}
            vacioFlex={1}
          />
        </CardContent>

        <CardFooter className="flex justify-end px-4 pb-4">
          <Button type="button" variant="outline" onClick={onCerrar}>
            Cancelar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
