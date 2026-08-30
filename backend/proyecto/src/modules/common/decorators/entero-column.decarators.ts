import { Column } from "typeorm";

export function EnteroColumn(defaultValue: number = 0) {
  return Column('int', {
    default: defaultValue,
    transformer: {
      to: (value: number | string): number => Number(value),
      from: (value: number): number => Number(value),
    },
  });
}