export const DecimalTransformer = {
  to: (value: number | string): string => value?.toString(),
  from: (value: string): number => parseFloat(value),
};
