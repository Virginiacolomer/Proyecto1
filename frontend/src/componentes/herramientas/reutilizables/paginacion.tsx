import { Button } from "../../ui/Button";
import Select from "react-select";

interface PaginacionProps {
  entidadesTotales: number;
  take: number;
  paginaActual: number;
  onChange: (skip: number, take: number, currentPage: number) => void;
}

export const Takes = {
  5: 5,
  10: 10,
  25: 25,
  50: 50,
  75: 75,
  100: 100,
};

export default function Paginacion({ entidadesTotales, take, paginaActual, onChange }: PaginacionProps) {
  const totalPaginas = Math.ceil(entidadesTotales / take);

  if (totalPaginas <= 1) return null;

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      const skip = (nuevaPagina - 1) * take;
      onChange(skip, take, nuevaPagina);
    }
  };

  const generarRango = () => {
    const rango = [];
    const maxBotones = 4;
    let inicio = Math.max(1, paginaActual - Math.floor(maxBotones / 2));
    const fin = Math.min(totalPaginas, inicio + maxBotones - 1);

    if (fin - inicio + 1 < maxBotones) {
      inicio = Math.max(1, fin - maxBotones + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      rango.push(i);
    }
    return rango;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <div>
        <div className="w-full">
          <Select
            value={
              Object.entries(Takes)
                .map(([key, value]) => ({
                  id: value,
                  denominacion: key, // or provide a more user-friendly label if needed
                }))
                .find((option) => option.id === take) || null
            }
            options={Object.entries(Takes).map(([key, value]) => ({
              id: value,
              denominacion: key, // or provide a more user-friendly label if needed
            }))}
            getOptionLabel={(option) => option.denominacion}
            getOptionValue={(option) => String(option.id)}
            onChange={(selectedOption) => {
              if (selectedOption) {
                onChange(0, selectedOption.id, 1);
              }
            }}
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
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
          />
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        size="sm"
        onClick={() => cambiarPagina(paginaActual - 1)}
        disabled={paginaActual === 1}
        className="bg-black text-white hover:bg-gray-800"
      >
        {"<"}
      </Button>

      {generarRango().map((pagina) => (
        <Button
          key={pagina}
          variant={pagina === paginaActual ? "default" : "outline"}
          size="sm"
          type="button"
          onClick={() => cambiarPagina(pagina)}
          className={`bg-black text-white hover:bg-gray-800 ${pagina === paginaActual ? `bg-blue-700` : ``}`}
        >
          {pagina}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={() => cambiarPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        className="bg-black text-white hover:bg-gray-800"
      >
        {">"}
      </Button>
    </div>
  );
}
