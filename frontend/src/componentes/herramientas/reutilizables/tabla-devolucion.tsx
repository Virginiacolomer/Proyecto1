import { useState, useEffect } from "react";
import { Column, TablaAGGrid } from "../../herramientas/tablas/tabla-flexible-ag-grid";
import { jwtDecode } from "jwt-decode";

import { ConsultarNotasCreditoVenta } from "../../../interfaces/gestion-venta/nota-credito/interfaces-nota-credito-venta";
import NotaCreditoVentaService from "../../gestion-venta/nota-credito-venta/services/nota-credito-venta-service";
import { Card, CardContent } from "../../ui/Card";

export default function TablaDevolucion() {
  const token = localStorage.getItem("Token");
  const empresaId = token ? jwtDecode<{ empresaId: number }>(token).empresaId : 0;

  const [notasCredito, setNotasCredito] = useState<ConsultarNotasCreditoVenta[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [, setHasMore] = useState(true);
  const [, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const take = 10; // Cantidad de productos por página
  const filtros = {
    empresaId: empresaId,
    page: currentPage,
    take: take,
  };

  const fetchNotasCredito = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await NotaCreditoVentaService.obtener(filtros);

      console.log("Nota Credito:", response.data);

      setNotasCredito(response.data);
      setHasMore(response.total === take);
      setCurrentPage(page);
    } catch (err: any) {
      console.error("Error al obtener las Notas Credito:", err);
      setError("No se pudieron cargar las Notas Credito.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotasCredito(currentPage);
  }, [currentPage]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "No tiene";

    const [year, month, day] = dateString.split("-");
    if (!year || !month || !day) return "Fecha inválida";

    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  };

  // Adaptar columns para que cumpla con el tipo Column<FacturaVenta>
  const columns: Column<ConsultarNotasCreditoVenta>[] = [
    {
      header: "Item",
      accessor: "fechaDocumento",
      flex: 0.5,
      type: "text",
      editable: false,
      formatFunction: ({ value }) => <span>{formatDate(value)}</span>,
    },
  ];

  return (
    <div className="w-full">
      <Card className="w-full bg-white shadow-md rounded-md mt-4">
        <CardContent className="flex justify-center py-4">
          <div className="w-full">
            <TablaAGGrid columns={columns} data={notasCredito} onUpdate={() => {}} actionsFlex={0.5} vacioFlex={1.5} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
