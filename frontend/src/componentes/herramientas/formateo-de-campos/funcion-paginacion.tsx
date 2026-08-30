export function getPageNumbers(current: number, totalPages: number): (number | "...")[] {
  const pages: (number | "...")[] = [];

  if (totalPages < 4) {
    // Si hay pocas páginas, mostrar todas
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1); // Siempre mostrar la primera

    if (current > 3) {
      pages.push("...");
    }

    // Páginas alrededor de la actual
    for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
      pages.push(i);
    }

    if (current < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages); // Siempre mostrar la última
  }

  return pages;
}
