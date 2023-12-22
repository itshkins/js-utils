export declare function booleanMapToArray(index: Record<string, boolean>, value?: boolean): string[];
export declare function arrayToBooleanMap(array: string[], value?: boolean): {
    [k: string]: boolean;
};
export declare function toggleBooleanMap(index: Record<string, boolean>, key: any): Record<string, boolean>;
export declare function takeMapItem<T>(index: Record<string, T>, key: string): T;
export declare function toggleArrayValue<TValue>(values: TValue[], value: TValue): boolean;
export declare function isActiveArrayValue<TValue>(values: TValue[], value: TValue, activeIfEmpty?: boolean): boolean;
export declare function arrayToOrderMap(array: unknown[]): Record<string, number>;
export declare function sequenceToValuesWithCount(sequence: unknown[]): Array<{
    value: unknown;
    count: number;
}>;
export declare function getValuesWithCountLog(valuesWithCount: Array<{
    value: unknown;
    count: number;
}>): string[];
export declare function setIndexMapValue(index: Map<unknown, any>, keys: unknown[], value: unknown): boolean;
export declare function getIndexMapValue(index: Map<unknown, any>, keys: unknown[], defaultValue?: any): unknown;
export declare function removeIndexMapValue(index: Map<unknown, any>, keys: unknown[], value?: unknown): boolean;
