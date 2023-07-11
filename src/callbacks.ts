import {ARRAY, OBJECT} from './constants'

export const NOOP = (_?: unknown) => undefined
export const YES = () => true
export const NO = () => false
export const TOGGLE = (v) => !v
export const GET_ARRAY = () => ARRAY
export const GET_OBJECT = () => OBJECT
export const IDENTITY = (v) => v
export const IDENTITIES = (...v) => v
export const HAS_ITEMS = (v: unknown[]) => Array.isArray(v) && v.length !== 0
export const SET_FILTER = (item, index, array) => array.indexOf(item) === index
export const SORT_NUMBER = (number, otherNumber) => number - otherNumber
export const TO_NUMBER = (value) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}
export const UNIQUE = <TItem>(array: readonly TItem[]): TItem[] => Array.from(new Set(array))
