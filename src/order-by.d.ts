export type Selector<T> = (it: T) => unknown;
export declare const ASC = 1;
export declare const DESC = -1;
export declare const orderBy: <T>(iterable: Iterable<T>, selector?: Selector<T>) => T[];
export declare const orderByDescending: <T>(iterable: Iterable<T>, selector?: Selector<T>) => T[];
