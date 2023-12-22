const UNDEFINED = Symbol(`UNDEFINED`)
import {defineMethodDecorator, defineMethodDecoratorTS, Method} from './decorator-helpers'

export interface Cached {
  (...args: unknown[]): unknown;

  hasResult(): boolean;

  invalidate(): void;
}

function createCached<TResult>(object: object, key: string, value: Method<TResult> = object[key]): Cached {
  const callback = value.bind(object)
  let result: TResult | typeof UNDEFINED = UNDEFINED
  const decorated = {
    [key](...args) {
      if (result === UNDEFINED) {
        result = callback(...args)
      }
      return result
    },
  }[key] as Cached

  decorated.hasResult = () => result !== UNDEFINED

  decorated.invalidate = () => {
    result = UNDEFINED
  }
  return decorated
}

export function cached() {
  return defineMethodDecorator((object, key) => createCached(object, object[key]))
}

export function cachedTS() {
  return defineMethodDecoratorTS((object, key, value) => createCached(object, key, value))
}
