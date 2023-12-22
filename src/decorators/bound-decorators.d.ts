export declare function bound(): import("./decorator-helpers").DecoratorFunction;
export declare function boundTS(): (classOrPrototype: any, propertyKey: string, descriptor: any) => void;
export declare function boundClassTS(): <TConstructor extends new (...args: any[]) => object>(Target: TConstructor) => {
    new (...args: any[]): {};
} & TConstructor;
