import {ARRAY, OBJECT} from './constants'

import {now, formatTime, formatTimeSpan} from './dates'

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

export function flushDefers(defers: (() => void)[]) {
  for (const defer of defers) {
    defer()
  }
  defers.length = 0
}

export async function sleep(ms: number, onLog?: (message: unknown) => void) {
  if (onLog) {
    const aliveAt = formatTime(now().add(ms), true)
    onLog(`sleep:${formatTimeSpan(ms, true)} aliveAt:${aliveAt}`)
  }
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function loopCallback(key: string, callback: () => Promise<any>, firstInterval: number, nextInterval = firstInterval) {
  setTimeout(() => {
    callback()
      .catch((e) => {
        console.error(key, e)
      })
      .finally(() => {
        loopCallback(key, callback, nextInterval)
      })
  }, firstInterval)
}

export async function promises(keyToPromise: Record<string, Promise<unknown>>) {
  keyToPromise = {...keyToPromise}
  const result = {}
  // eslint-disable-next-line guard-for-in
  for (const key in keyToPromise) {
    keyToPromise[key] = keyToPromise[key].then((localResult) => {
      result[key] = localResult
    })
  }
  await Promise.all(Object.values(keyToPromise))
  return result
}


