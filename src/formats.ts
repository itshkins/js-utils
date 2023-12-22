import {IDENTITY} from './callbacks';

const SIMPLE_CSV_SEPARATOR = `,`;

export function parseSimpleCsv<TItem = string>(csv: unknown, map: (value: string) => TItem = IDENTITY): TItem[] {
  return String(csv ?? ``)
    .split(SIMPLE_CSV_SEPARATOR)
    .map(map)
    .filter(Boolean);
}

export function stringifySimpleCsv(values: unknown[]): string {
  return values.join(SIMPLE_CSV_SEPARATOR);
}

export function parseJSON<TValue>(jsonString: string, defaultValue: TValue | undefined = undefined) {
  if (!jsonString) {
    return defaultValue;
  }
  try {
    return JSON.parse(jsonString);
  }
  catch {
    return defaultValue;
  }
}

export function pipeJSON(value: unknown): unknown {
  return JSON.parse(JSON.stringify(value));
}

export const isWorse = (pos?: number, otherPos?: number) => pos! > otherPos!;
export const notWorse = (pos?: number, otherPos?: number) => pos! <= otherPos!;
export const isBetter = (pos?: number, otherPos?: number) => pos! < otherPos!;
export const notBetter = (pos?: number, otherPos?: number) => pos! >= otherPos!;
