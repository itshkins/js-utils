import {bind, defineMethodDecorator, defineMethodDecoratorTS, getMethodKeys} from './decorator-helpers';

export function bound() {
  return defineMethodDecorator(bind);
}

export function boundTS() {
  return defineMethodDecoratorTS(bind);
}

export function boundClassTS() {
  return function <TConstructor extends { new (...args: any[]): object }>(Target: TConstructor) {
    const names = getMethodKeys(Target);
    return class extends Target {
      constructor(...args) {
        super(...args);
        for (const name of names) {
          Object.defineProperty(this, name, {value: bind(this, name)});
        }
      }
    };
  };
}
