import {IDENTITY} from './callbacks'

export type Selector<T> = (it: T) => unknown

export const ASC = 1
export const DESC = -1

const doOrderBy = <T>(
  iterable: Iterable<T>,
  dir: typeof ASC | typeof DESC,
  selector: Selector<T>,
) => {
  return Array.from(iterable).sort((a: any, b: any) => {
    a = selector(a)
    b = selector(b)
    if (a < b) {
      return -dir
    }
    if (a > b) {
      return dir
    }
    return 0
  })
}

export const orderBy = <T>(
  iterable: Iterable<T>,
  selector: Selector<T> = IDENTITY,
) => doOrderBy(iterable, ASC, selector)

export const orderByDescending = <T>(
  iterable: Iterable<T>,
  selector: Selector<T> = IDENTITY,
) => doOrderBy(iterable, DESC, selector)
