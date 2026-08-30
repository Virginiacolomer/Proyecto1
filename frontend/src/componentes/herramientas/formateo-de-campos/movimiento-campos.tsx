import { useCallback } from "react";

export function useEnterFocus(nextRef?: React.RefObject<HTMLElement | null>) {
  return useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Detectar si es react-select u otro custom select por atributos
      const target = e.target as HTMLElement;
      const isSelectInput = target.getAttribute("aria-expanded") !== null || target.closest(".react-select__control");

      if (!isSelectInput) {
        // Permitir que el Enter seleccione la opción en el select
        e.preventDefault();
      }

      const nextTarget = nextRef?.current;

      if (nextTarget) {
        if (nextTarget instanceof HTMLButtonElement) {
          nextTarget.click();
        } else {
          nextTarget.focus();
        }
        return;
      }

      const form = e.currentTarget.form;
      const index = Array.prototype.indexOf.call(form, e.currentTarget);
      const next = form?.elements[index + 1] as HTMLElement;
      if (next && typeof next.focus === "function") {
        e.preventDefault();
        next.focus();
      }
    }
  }, []);
}
