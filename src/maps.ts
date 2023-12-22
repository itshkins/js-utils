import {UNSET} from './constants'

export function booleanMapToArray(index: Record<string, boolean>, value = true) {
  return Object.keys(index).filter((key) => index[key] === value)
}

export function arrayToBooleanMap(array: string[], value = true) {
  return Object.fromEntries(array.map((it) => [it, value]))
}

export function toggleBooleanMap(index: Record<string, boolean>, key) {
  if (index[key]) {
    delete index[key]
    return index
  }
  index[key] = true
  return index
}

export function takeMapItem<T>(index: Record<string, T>, key: string) {
  const result = index[key]
  delete index[key]
  return result
}

export function toggleArrayValue<TValue>(values: TValue[], value: TValue) {
  const index = values.indexOf(value)
  if (index !== -1) {
    values.splice(index, 1)
    return false
  }
  values.push(value)
  return true
}

export function isActiveArrayValue<TValue>(values: TValue[], value: TValue, activeIfEmpty = false) {
  return values.length === 0
    ? activeIfEmpty
    : values.includes(value)
}

export function arrayToOrderMap(array: unknown[]): Record<string, number> {
  return Object.fromEntries(array.map((it, order) => [it, order + 1]))
}

export function sequenceToValuesWithCount(sequence: unknown[]): Array<{ value: unknown, count: number }> {
  let value: unknown = UNSET
  let count = 0
  const valuesWithCount: Array<{ value: unknown, count: number }> = []
  for (const sequenceValue of sequence) {
    if (sequenceValue === value) {
      count++
      continue
    }
    if (count > 0) {
      valuesWithCount.push({value, count})
    }
    value = sequenceValue
    count = 1
  }
  if (count > 0) {
    valuesWithCount.push({value, count})
  }
  return valuesWithCount
}

export function getValuesWithCountLog(valuesWithCount: Array<{ value: unknown, count: number }>): string[] {
  return valuesWithCount.map(({value, count}) => `${JSON.stringify(value)}x${count}`)
}

export function setIndexMapValue(index: Map<unknown, any>, keys: unknown[], value: unknown): boolean {
  let localIndex = index
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (i === keys.length - 1) {
      localIndex.set(key, value)
      return true
    }
    if (!localIndex.has(key)) {
      localIndex.set(key, new Map())
    }
    localIndex = localIndex.get(key)
  }
  return false
}

export function getIndexMapValue(index: Map<unknown, any>, keys: unknown[], defaultValue: any = undefined): unknown {
  let localIndex = index
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (typeof localIndex !== `object` || !localIndex.has(key)) {
      return defaultValue
    }
    localIndex = localIndex.get(key)
  }
  return localIndex
}

export function removeIndexMapValue(index: Map<unknown, any>, keys: unknown[], value: unknown = UNSET): boolean {
  const indices = [index]
  let currentIndex = index
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if (!currentIndex.has(key)) {
      return false
    }

    if (i < keys.length - 1) {
      currentIndex = currentIndex.get(key)
      indices.push(currentIndex)
      continue
    }

    if (value !== UNSET && currentIndex.get(key) !== value) {
      return false
    }
    currentIndex.delete(key)
    for (let j = indices.length - 1; j > 0; j--) {
      if (indices[j].size === 0) {
        indices[j - 1].delete(keys[j - 1])
      }
    }
    return true
  }
  return false
}
