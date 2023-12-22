export interface Synchronized {
    (...args: unknown[]): unknown;
    isPending(): boolean;
    invalidate(): void;
}
export declare function synchronized(): import("./decorator-helpers").DecoratorFunction;
export declare function synchronizedTS(): (classOrPrototype: any, propertyKey: string, descriptor: any) => void;
