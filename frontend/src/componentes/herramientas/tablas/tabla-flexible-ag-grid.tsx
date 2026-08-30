import { JSX, useCallback, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community"; // <-- Importamos los módulos

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// Registramos todos los módulos de la Community Edition
ModuleRegistry.registerModules([AllCommunityModule]);

export interface Column<T> {
  header: string;
  accessor: keyof T;
  type?: "text" | "select";
  options?: string[];
  editable?: boolean;
  formatFunction?: (params: { value: any; row: T }) => JSX.Element;
  width?: number; // ancho fijo
  minWidth?: number; // ancho mínimo
  maxWidth?: number; // ancho máximo
  flex?: number;
  align?: "left" | "center" | "right";
  scrollable?: boolean;
}

interface TablaAGGridProps<T> {
  columns: Column<T>[];
  data: T[];
  onUpdate?: (newData: T[]) => void;
  actions?: (row: T, rowIndex: number) => JSX.Element;
  actionsFlex: number;
  vacioFlex?: number;
  actionsScrollable?: boolean;
  rowHeight?: number;
  getRowClass?: (params: any) => string | string[] | undefined;
  /** Altura fija del contenedor en px. Activa virtualización de filas (recomendado para listas grandes). */
  height?: number;
}

export function TablaAGGrid<T extends Record<string, any>>({
  columns,
  data,
  onUpdate,
  actions,
  actionsFlex,
  vacioFlex,
  actionsScrollable,
  rowHeight,
  getRowClass,
  height,
}: TablaAGGridProps<T>) {
  const gridRef = useRef<AgGridReact>(null);

  // 🔧 Columnas de AG Grid
  const columnDefs = useMemo(() => {
    const baseCols = columns.map((col) => {
      const colDef: any = {
        headerName: col.header,
        field: col.accessor as string,
        editable: col.editable || false,
        flex: col.flex ?? 1,
        //width: col.width,          // <-- ancho fijo (en píxeles)
        minWidth: col.minWidth, // <-- ancho mínimo
        maxWidth: col.maxWidth, // <-- ancho máximo
        //tooltipField: col.accessor as string,
        sortable: false,
        //filter: true,

        cellStyle: () => {
          return {
            display: "flex",
            alignItems: "center",
            whiteSpace: col.scrollable ? "nowrap" : "normal",
            overflowX: col.scrollable ? "auto" : "visible",
            maxWidth: "100%",
            justifyContent: col.align === "right" ? "flex-end" : col.align === "center" ? "center" : "flex-start",
          };
        },
        cellRenderer: !col.formatFunction
          ? (params: any) => (
              <div
                style={{
                  overflowX: col.scrollable ? "auto" : "hidden", // ✅ importante
                  whiteSpace: col.scrollable ? "nowrap" : "normal",
                  maxWidth: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    minWidth: col.scrollable ? "200px" : "auto", // ✅ Solo fuerza ancho si scrollable = true
                    height: "100%",
                    boxSizing: "border-box",
                    alignItems: "center",
                    overflow: "hidden", // adicional: previene scroll visual si no corresponde
                    textOverflow: "ellipsis", // opcional: recorta texto con puntos suspensivos
                  }}
                >
                  {params.value}
                </div>
              </div>
            )
          : (params: any) => col.formatFunction!({ value: params.value, row: params.data }),
        cellEditor: col.type === "select" ? "agSelectCellEditor" : undefined,
        cellEditorParams: col.type === "select" && col.options ? { values: col.options } : undefined,
      };
      return colDef;
    });

    if (actions) {
      if (vacioFlex) {
        baseCols.push({
          headerName: "",
          field: "emptySpacer",
          cellRenderer: () => null,
          editable: false,
          suppressMenu: true,
          sortable: false,
          flex: vacioFlex,
          cellStyle: { backgroundColor: "transparent" },
        });
      }

      baseCols.push({
        headerName: "Acciones",
        field: "actions",
        cellRenderer: (params: any) => (
          <div
            style={{
              maxWidth: "200px", // 👈 Limita explícitamente el ancho visible
              overflowX: actionsScrollable ? "auto" : "hidden",
              whiteSpace: actionsScrollable ? "nowrap" : "normal",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                minWidth: actionsScrollable ? "300px" : "auto", // 👈 Asegura que el contenido desborde
                height: "100%",
                boxSizing: "border-box",
                alignItems: "center",
                paddingTop: "4px",
                paddingBottom: "4px",
              }}
            >
              {actions?.(params.data, params.node.rowIndex)}
            </div>
          </div>
        ),

        editable: false,
        suppressMenu: true,
        sortable: false,
        flex: actionsFlex,
        cellStyle: {
          display: "block",
          overflowX: actionsScrollable ? "auto" : "hidden",
          whiteSpace: actionsScrollable ? "nowrap" : "normal",
        },
      });
    }

    return baseCols;
  }, [columns, actions, actionsFlex, actionsScrollable]);

  // 🧠 Control de edición
  const onCellValueChanged = useCallback(
    (params: any) => {
      const newData = gridRef.current?.api.getDisplayedRowAtIndex(params.rowIndex)?.data;
      const updatedData = data.map((row, i) => (i === params.rowIndex ? newData : row));
      onUpdate?.(updatedData);
    },
    [data, onUpdate],
  );

  /*
  const exportToCsv = () => {
    gridRef.current?.api.exportDataAsCsv();                 // Exporta los datos a CSV o Excel
  };
  */

  const localeText = {
    // Filtros comunes
    contains: "Contiene",
    notContains: "No contiene",
    startsWith: "Empieza con",
    endsWith: "Termina con",
    equals: "Igual a",
    notEqual: "Distinto de",
    lessThan: "Menor que",
    greaterThan: "Mayor que",
    lessThanOrEqual: "Menor o igual que",
    greaterThanOrEqual: "Mayor o igual que",
    inRange: "En rango",
    blank: "En blanco",
    notBlank: "No en blanco",
    andCondition: "Y",
    orCondition: "O",

    // Menús
    filterOoo: "Filtrar...",
    applyFilter: "Aplicar",
    resetFilter: "Reiniciar",
    clearFilter: "Limpiar",
    cancelFilter: "Cancelar",

    // Columnas
    columns: "Columnas",
    filters: "Filtros",

    // Menú de columna
    pinColumn: "Fijar columna",
    valueAggregation: "Agrupar valor",
    autosizeThiscolumn: "Autoajustar esta columna",
    autosizeAllColumns: "Autoajustar todas",
    resetColumns: "Resetear columnas",
    expandAll: "Expandir todo",
    collapseAll: "Colapsar todo",
    copy: "Copiar",
    export: "Exportar",

    // Otros
    noRowsToShow: "No hay filas para mostrar",
  };

  const gridApiRef = useRef<any>(null);

  const onGridReady = useCallback((params: any) => {
    gridApiRef.current = params.api;
  }, []);

  return (
      <div className="ag-theme-alpine dark:ag-theme-alpine-dark" style={height ? { height } : undefined}>
        <AgGridReact
          ref={gridRef}
          rowData={data}
          columnDefs={columnDefs}
          getRowClass={getRowClass}
          onCellValueChanged={onCellValueChanged}
          domLayout={height ? "normal" : "autoHeight"}
          rowHeight={rowHeight ?? 70}
          headerHeight={35}
          localeText={localeText}
          onGridReady={onGridReady}
          defaultColDef={{ resizable: false }}
          suppressMovableColumns={true}
        />
        {/* <button onClick={exportToCsv}>Exportar CSV</button>   {/* Exporta los datos a CSV o Excel */}
      

      <style>
        {`
          .ag-theme-alpine .ag-row-hover {
            background-color: rgba(59, 130, 246, 0.1);
          }
          .ag-theme-alpine-dark .ag-row-hover {
            background-color: rgba(147, 197, 253, 0.1);
          }
          /* Líneas entre columnas */
          .ag-theme-alpine .ag-cell {
            border-right: 1px solid #d1d5db;
          }
          .ag-theme-alpine .ag-header-cell {
            border-right: 1px solid #d1d5db;
          }

          .ag-theme-alpine-dark .ag-cell {
            border-right: 1px solid #4b5563;
          }

          /* Líneas entre filas */
          .ag-theme-alpine .ag-row:not(.ag-row-last) .ag-cell {
            border-bottom: 1px solid #f3f4f6;
          }

          .ag-theme-alpine-dark .ag-row:not(.ag-row-last) .ag-cell {
            border-bottom: 1px solid #374151;
          }

          .ag-theme-alpine .ag-header,
          .ag-theme-alpine .ag-header-cell {
            background-color: #bae6fd !important; 
            color: #111827; 
          }

          .ag-theme-alpine-dark .ag-header,
          .ag-theme-alpine-dark .ag-header-cell {
            background-color: #bae6fd !important; 
            color: #f9fafb;
          }

          .ag-theme-alpine .ag-header {
            border-bottom: 2px solid #d1d5db;
          }

          .ag-theme-alpine-dark .ag-header {
            border-bottom: 2px solid #4b5563;
          }

        `}
      </style>
    </div>
  );
}
