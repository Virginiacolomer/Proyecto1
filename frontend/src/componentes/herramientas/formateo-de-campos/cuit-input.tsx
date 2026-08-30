import { useMask } from "@react-input/mask";

export function limpiarCuit(cuit: string): string {
  return cuit.replace(/\D/g, ""); // \D = todo lo que NO es dígito
}

export function formatearCuit(cuit: string): string {
  const soloNumeros = cuit.replace(/\D/g, ""); // limpia por si viene con caracteres raros
  if (soloNumeros.length !== 11) return cuit; // si no tiene 11 dígitos, lo devuelvo como está

  return `${soloNumeros.slice(0, 2)}-${soloNumeros.slice(2, 10)}-${soloNumeros.slice(10)}`;
}

export default function CuitInput() {
  const inputRef = useMask({ mask: "__-________-_", replacement: { _: /\d/ } });

  return <input ref={inputRef} placeholder="xx-xxxxxxxx-x" />;
}
