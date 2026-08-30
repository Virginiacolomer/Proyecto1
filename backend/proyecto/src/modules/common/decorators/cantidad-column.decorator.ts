import { Column } from "typeorm";

export function CantidadColumn(defaultValue: number = 0) {
  return Column('decimal', {
    precision: 12,
    scale: 3,
    default: defaultValue,
    transformer: {
      to: (value: number | string): string => value?.toString(),
      from: (value: string): number => Number(value),
    },
  });
}