export class CurrencyUtil {
  static getCurrencyName(codigo: number): string {
    switch (codigo) {
      case 0:
        return 'Pesos';
      case 1:
        return 'Dólar';
      case 2:
        return 'Euro';
      default:
        return 'Desconocido';
    }
  }

  static getCurrencySymbol(codigo: number): string {
    switch (codigo) {
      case 0:
        return '$';    // Pesos
      case 1:
        return 'US$';  // Dólar
      case 2:
        return '€';    // Euro
      default:
        return '';
    }
  }
}