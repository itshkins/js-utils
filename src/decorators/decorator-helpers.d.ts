export declare function bind(object: object, method: string | symbol): any;
export declare function formatFunctionTitle(withObject: any, withArgs: any, object: any, name: any, args: any, transformArgs?: (...v: any[]) => any[]): string;
export declare function getMethodKeys(target: any): (string | symbol)[];
export type DecoratorProps = {
    kind: string;
    name: string;
    addInitializer: (VoidFunction: any) => void;
};
export type Method<TResult = unknown> = (this: any, ...args: unknown[]) => TResult;
export type DecoratorFunction = (target: any, props: DecoratorProps) => unknown | void;
export type KindToDecorate = Record<string, DecoratorFunction>;
export declare function defineDecorator(kindToDecorate: KindToDecorate): DecoratorFunction;
export declare function defineMethodDecorator(onInitialize: (object: any, method: string | symbol, value: Function) => Function): DecoratorFunction;
type DecorateMethod = (classOrPrototype: any, propertyKey: string, descriptor: any) => void;
type DoDecorateMethod = (context: object, propertyKey: string, value: Method) => Method;
export declare function defineMethodDecoratorTS(doDecorate: DoDecorateMethod): DecorateMethod;
export {};
