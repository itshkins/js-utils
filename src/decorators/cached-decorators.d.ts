export interface Cached {
    (...args: unknown[]): unknown;
    hasResult(): boolean;
    invalidate(): void;
}
export declare function cached(): import("./decorator-helpers").DecoratorFunction;
export declare function cachedTS(): (classOrPrototype: any, propertyKey: string, descriptor: any) => void;
