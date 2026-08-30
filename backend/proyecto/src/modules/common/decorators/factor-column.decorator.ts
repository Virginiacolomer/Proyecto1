import { Column } from 'typeorm';

export function FactorColumn(defaultValue: number = 0.0) {
  return Column('decimal', {
    precision: 7,
    scale: 5,
    default: defaultValue,
    transformer: {
      to: (value: number | string): string => value?.toString(),
      from: (value: string): number => Number(value),
    },
  });
}