import { Column } from 'typeorm';

export function MonetarioColumn(defaultValue: number = 0) {
  return Column('decimal', {
    precision: 15,
    scale: 5,
    default: defaultValue,
    transformer: {
      to: (value: number | string): string => value?.toString(),
      from: (value: string): number => Number(value),
    },
  });
}