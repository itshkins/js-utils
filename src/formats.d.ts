export declare function parseSimpleCsv<TItem = string>(csv: unknown, map?: (value: string) => TItem): TItem[];
export declare function stringifySimpleCsv(values: unknown[]): string;
export declare function parseJSON<TValue>(jsonString: string, defaultValue?: TValue | undefined): any;
export declare function pipeJSON(value: unknown): unknown;
export declare const isWorse: (pos?: number, otherPos?: number) => boolean;
export declare const notWorse: (pos?: number, otherPos?: number) => boolean;
export declare const isBetter: (pos?: number, otherPos?: number) => boolean;
export declare const notBetter: (pos?: number, otherPos?: number) => boolean;
