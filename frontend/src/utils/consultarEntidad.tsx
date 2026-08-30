// ConsultaEntidad.tsx
import { useState, useEffect } from "react";
import { PlusCircle, Search } from "lucide-react";
import { Column, ModeloTabla } from "../componentes/herramientas/tablas/modelo-tabla";
import { Input } from "../componentes/ui/Input";
import { Button } from "../componentes/ui/Button";

interface Props<T> {
  titulo: string;
  servicio: {
    obtener: (page: number, take: number, searchTerm: string) => Promise<T[]>;
    eliminar: (id: number) => Promise<void>;
    obtenerUsuarioId?: (id: number) => Promise<any>;
  };
  FormComponente: React.ComponentType<{
    onClose: () => void;
    onSuccess: () => void;
  }>;
  columnas: Column<T>[];
  nombreEntidad: string;
  extraFilter?: (item: T, term: string) => boolean;
  onEdit?: (item: T) => void;
  onInfo?: (item: T) => void;
}

export default function ConsultaEntidad<T extends { id: number }>({
  titulo,
  servicio,
  FormComponente,
  columnas,
  nombreEntidad,
  extraFilter,
  //onEdit,
  //onInfo
}: Props<T>) {
  const [datos, setDatos] = useState<T[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const take = 10;
  const totalVisiblePages = 3;
  const startPage = Math.max(1, currentPage - Math.floor(totalVisiblePages / 2));
  const pages = Array.from({ length: totalVisiblePages }, (_, i) => startPage + i);

  useEffect(() => {
    const fetchDatos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await servicio.obtener(currentPage, take, searchTerm);
        setDatos(response);
        setHasMore(response.length === take);
      } catch (err: any) {
        console.error(`Error al obtener ${nombreEntidad}s:`, err);
        setError(`No se pudieron cargar los ${nombreEntidad}s.`);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [currentPage, searchTerm, refresh]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && (newPage < currentPage || hasMore)) {
      setCurrentPage(newPage);
    }
  };

  /*
  const handleDelete = async (id: number) => {
    const confirmed = confirm(`¿Estás seguro de que deseas eliminar esta ${nombreEntidad}?`)
    if (!confirmed) return

    try {
      await servicio.eliminar(id)
      setDatos(datos.filter((d) => d.id !== id))
    } catch (err: any) {
      console.error(`Error al eliminar ${nombreEntidad}:`, err)
      alert(`No se pudo eliminar la ${nombreEntidad}.`)
    }
  }
    */

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleSuccess = () => {
    setRefresh((prev) => !prev);
    closeModal();
  };

  const filtered = extraFilter ? datos.filter((d) => extraFilter(d, searchTerm)) : datos;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 to-blue-1000 dark:bg-gradient-to-br dark:from-blue-100 dark:to-blue-900">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <Input
              type="text"
              placeholder={titulo}
              className="pl-12 pr-4 py-3 w-full text-lg bg-white text-black caret-black rounded-md"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Button className="bg-blue-500 hover:bg-blue-700 text-white" onClick={openModal}>
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir
          </Button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[50%]">
              <FormComponente onClose={closeModal} onSuccess={handleSuccess} />
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-center text-white">Cargando...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <ModeloTabla data={filtered} columns={columnas} />
            </div>

            <div className="flex justify-center mt-4 space-x-2 text-white">
              <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                {"<"}
              </Button>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={page === currentPage ? "bg-blue-500" : ""}
                >
                  {page}
                </Button>
              ))}
              <Button onClick={() => handlePageChange(currentPage + 1)}>{">"}</Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
