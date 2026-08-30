import { Column } from 'typeorm';

export function PorcentajeColumn(defaultValue: number = 0.0) {
  return Column('decimal', {
    precision: 5,
    scale: 2,
    default: defaultValue,
    transformer: {
      to: (value: number | string): string => value?.toString(),
      from: (value: string): number => Number(value),
    },
  });
}
