import {defineMethodDecorator, defineMethodDecoratorTS, Method} from './decorator-helpers';

export interface Synchronized {
  (...args: unknown[]): unknown;

  isPending(): boolean;

  invalidate(): void;
}

function createCached<TResult>(object: object, key: string, value: Method = object[key]): Synchronized {
  const callback = value.bind(object) as Method<Promise<TResult>>;
  let promise: Promise<TResult> | undefined;
  const decorated = {
    [key](...args) {
      if (!promise) {
        promise = callback(...args).finally(() => {
          promise = undefined;
        });
      }
      return promise;
    },
  }[key] as Synchronized;

  decorated.isPending = () => promise !== undefined;

  decorated.invalidate = () => {
    promise = undefined;
  };
  return decorated;
}

export function synchronized() {
  return defineMethodDecorator((object, key) => createCached(object, object[key]));
}

export function synchronizedTS() {
  return defineMethodDecoratorTS((object, key, value) => createCached(object, key, value));
}
