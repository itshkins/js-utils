import {IDENTITIES, NOOP} from '../callbacks';

export function bind(object: object, method: string | symbol) {
  return object[method].bind(object);
}

export function formatFunctionTitle(withObject, withArgs, object, name, args, transformArgs = IDENTITIES) {
  const objectName = (object as any).name ?? object.constructor.name;
  const fullName = `${withObject ? `${objectName}.` : ``}${name}`;
  return withArgs
    ? `${fullName}(${JSON.stringify(transformArgs.apply(object, args)).slice(1, -1)})`
    : fullName;
}

export function getMethodKeys(target) {
  if (typeof Reflect !== `undefined` && typeof Reflect.ownKeys === `function`) {
    return Reflect.ownKeys(target.prototype);
  }
  const keys: Array<string | symbol> = Object.getOwnPropertyNames(target.prototype);
  if (typeof Object.getOwnPropertySymbols === `function`) {
    keys.push(...Object.getOwnPropertySymbols(target.prototype));
  }
  return keys;
}

export type DecoratorProps = {
  kind: string,
  name: string,
  addInitializer: (VoidFunction) => void,
};
export type Method<TResult = unknown> = (this: any, ...args: unknown[]) => TResult;
export type DecoratorFunction = (target: any, props: DecoratorProps) => unknown | void;
export type KindToDecorate = Record<string, DecoratorFunction>;

export function defineDecorator(kindToDecorate: KindToDecorate): DecoratorFunction {
  return (target, props) => {
    const decorate = kindToDecorate[props.kind] ?? NOOP;
    return decorate(target, props);
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineMethodDecorator(onInitialize: (object: any, method: string | symbol, value: Function) => Function) {
  return defineDecorator({
    method: (_, {name, addInitializer}) => {
      addInitializer(function (this: object) {
        // eslint-disable-next-line no-invalid-this
        Object.defineProperty(this, name, {value: onInitialize(this, name, this[name])});
      });
    },
    class: (Target) => {
      const names = getMethodKeys(Target);
      return class extends Target {
        constructor(...args) {
          super(...args);
          for (const name of names) {
            Object.defineProperty(this, name, {value: onInitialize(this, name, this[name as string])});
          }
        }
      };
    },
  });
}

type DecorateMethod = (classOrPrototype: any, propertyKey: string, descriptor: any) => void
type DoDecorateMethod = (context: object, propertyKey: string, value: Method) => Method

function decorateMethodTS(doDecorate: DoDecorateMethod, context: object, propertyKey: string, value: Method) {
  const newValue = doDecorate(context, propertyKey, value);
  Object.defineProperty(context, propertyKey, {
    value: newValue,
    configurable: true,
  });
  return newValue;
}

export function defineMethodDecoratorTS(doDecorate: DoDecorateMethod): DecorateMethod {
  return (classOrPrototype: any, propertyKey: string, previousDescriptor: any) => {
    function get(this: any) {
      const descriptor = Object.getOwnPropertyDescriptor(classOrPrototype, propertyKey)!;
      if (descriptor.value) {
        // eslint-disable-next-line no-invalid-this
        return decorateMethodTS(doDecorate, this, propertyKey, this[propertyKey]);
      }
      if (descriptor.get !== get) {
        // eslint-disable-next-line no-invalid-this
        return decorateMethodTS(doDecorate, this, propertyKey, this[propertyKey]);
      }
      if (previousDescriptor.value) {
        // eslint-disable-next-line no-invalid-this
        return decorateMethodTS(doDecorate, this, propertyKey, previousDescriptor.value);
      }
      if (previousDescriptor.get) {
        Object.defineProperty(classOrPrototype, propertyKey, previousDescriptor);
        // eslint-disable-next-line no-invalid-this
        return decorateMethodTS(doDecorate, this, propertyKey, previousDescriptor.get.call(this));
      }
      throw new Error(`createMethodDecorator: unexpected state`);
    }

    return {get};
  };
}
