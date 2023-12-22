import {MAX_PERCENTAGE} from './constants';
import {IDENTITY} from './callbacks';

enum OrderKey {
  FIRST,
  SECOND,
  THIRD,
}

enum MaleOrderSuffix {
  FIRST = `ый`,
  SECOND = `ой`,
  THIRD = `ий`,
}

enum FemaleOrderSuffix {
  SECOND = `ой`,
  THIRD = `ей`,
}

const TEN_REMAINDER_TO_NOMINATIVE_MALE: Record<number, string> = {
  0: MaleOrderSuffix.FIRST,
  1: MaleOrderSuffix.FIRST,
  2: MaleOrderSuffix.SECOND,
  3: MaleOrderSuffix.THIRD,
  4: MaleOrderSuffix.FIRST,
  5: MaleOrderSuffix.FIRST,
  6: MaleOrderSuffix.SECOND,
  7: MaleOrderSuffix.SECOND,
  8: MaleOrderSuffix.SECOND,
  9: MaleOrderSuffix.FIRST,
};

const TEN_REMAINDER_TO_GENITIVE_FEMALE: Record<number, string> = {
  0: FemaleOrderSuffix.SECOND,
  1: FemaleOrderSuffix.SECOND,
  2: FemaleOrderSuffix.SECOND,
  3: FemaleOrderSuffix.THIRD,
  4: FemaleOrderSuffix.SECOND,
  5: FemaleOrderSuffix.SECOND,
  6: FemaleOrderSuffix.SECOND,
  7: FemaleOrderSuffix.SECOND,
  8: FemaleOrderSuffix.SECOND,
  9: FemaleOrderSuffix.SECOND,
};

const TEN_REMAINDER_TO_ACCUSATIVE_FEMALE: Record<number, number> = {
  0: OrderKey.THIRD,
  1: OrderKey.FIRST,
  2: OrderKey.SECOND,
  3: OrderKey.SECOND,
  4: OrderKey.SECOND,
  5: OrderKey.THIRD,
  6: OrderKey.THIRD,
  7: OrderKey.THIRD,
  8: OrderKey.THIRD,
  9: OrderKey.THIRD,
};

export function getNominativeMaleOrder(value: number): string {
  value = Math.abs(value);
  const hundredRemainder = value % 100;
  if (10 <= hundredRemainder && hundredRemainder <= 19) {
    return MaleOrderSuffix.FIRST;
  }

  if (value === 0) {
    return MaleOrderSuffix.SECOND;
  }

  const tenRemainder = value % 10;
  return TEN_REMAINDER_TO_NOMINATIVE_MALE[tenRemainder];
}

export function getGenitiveFemaleOrder(value: number): string {
  value = Math.abs(value);
  const hundredRemainder = value % 100;
  if (10 <= hundredRemainder && hundredRemainder <= 19) {
    return FemaleOrderSuffix.SECOND;
  }

  const tenRemainder = value % 10;
  return TEN_REMAINDER_TO_GENITIVE_FEMALE[tenRemainder];
}

export function getAccusativeFemaleOrder(value: number, orderValues: [string, string, string]): string {
  value = Math.abs(value);
  const hundredRemainder = value % 100;
  if (10 <= hundredRemainder && hundredRemainder <= 19) {
    return orderValues[OrderKey.THIRD];
  }

  const tenRemainder = value % 10;
  return orderValues[TEN_REMAINDER_TO_ACCUSATIVE_FEMALE[tenRemainder]];
}

export function formatSize(size, sizeFactor = 1024) {
  if (!Number.isFinite(size)) {
    return `-`;
  }

  if (size < sizeFactor) {
    return `${formatNumber(size)} байт`;
  }

  size /= sizeFactor;
  if (size < sizeFactor) {
    return `${formatNumber(size)} Кбайт`;
  }

  size /= sizeFactor;
  if (size < sizeFactor) {
    return `${formatNumber(size)} Мбайт`;
  }

  size /= sizeFactor;
  return `${formatNumber(size)} Гбайт`;
}

export function formatNumber(number: unknown, fractionDigits = 0, decimalPoint = `.`, thousandSeparator = `&nbsp;`, defaultValue = `-`) {
  if (!Number.isFinite(number)) {
    return defaultValue;
  }
  return (number as number)
    .toFixed(fractionDigits)
    .replace(/[.,]/g, decimalPoint)
    .replace(/\B(?=(?:\d{3})+(?!\d))/g, thousandSeparator);
}

export function roundNumber(number: number, factor: number, onRound = Math.round) {
  return onRound(number / factor) * factor;
}

export function roundDecimalNumber(number: number, precision: number, onRound = Math.round) {
  if (!Number.isFinite(number)) {
    return undefined;
  }
  const factor = 10 ** precision;
  return onRound(number * factor) / factor;
}

export function getPercentage(thisValue, prevValue) {
  if (!thisValue || !prevValue) {
    return undefined;
  }
  const fraction = (thisValue - prevValue) / (prevValue ?? 1);
  return Math.round(fraction * MAX_PERCENTAGE);
}

export function getPercentageDecimals(percentage) {
  return percentage < 4
    ? 1
    : 0;
}

export function formatPercentage(percentage) {
  return formatNumber(percentage, getPercentageDecimals(percentage));
}

export type GetNumber<TItem> = (item: TItem) => number;

export function calcAsc<TItem>(a: TItem, b: TItem, getValue: GetNumber<TItem> = IDENTITY) {
  return getValue(a) - getValue(b);
}

export function calcDesc<TItem>(a: TItem, b: TItem, getValue: GetNumber<TItem> = IDENTITY) {
  return getValue(b) - getValue(a);
}

export function compareAsc<TItem>(getValue: GetNumber<TItem> = IDENTITY) {
  return (a: TItem, b: TItem) => calcAsc(a, b, getValue);
}

export function compareDesc<TItem>(getValue: GetNumber<TItem> = IDENTITY) {
  return (a: TItem, b: TItem) => calcDesc(a, b, getValue);
}
