declare module "constants" {
    export const UNDEFINED: Readonly<{}>;
    export const OBJECT: any;
    export const JSON_OBJECT: string;
    export const ARRAY: readonly any[];
    export const JSON_ARRAY: string;
    export const FOREVER = true;
    export const MAX_PERCENTAGE = 100;
}
declare module "callbacks" {
    export const NOOP: (_?: unknown) => undefined;
    export const YES: () => boolean;
    export const NO: () => boolean;
    export const GET_ARRAY: () => readonly any[];
    export const GET_OBJECT: () => any;
    export const IDENTITY: (v: any) => any;
    export const IDENTITIES: (...v: any[]) => any[];
    export const NOT: (v: any) => boolean;
    export const HAS_ITEMS: (v: unknown[]) => boolean;
    export const SET_FILTER: (item: any, index: any, array: any) => boolean;
    export const SORT_NUMBER: (number: any, otherNumber: any) => number;
    export const TO_NUMBER: (value: any) => number | undefined;
    export const UNIQUE: <TItem>(array: readonly TItem[]) => TItem[];
}
declare module "size" {
    export const KB = 1024;
    export const MB: number;
    export const GB: number;
    export const TB: number;
    export const PB: number;
}
declare module "date" {
    export const DATE_LENGTH = 10;
    export const TIME_LENGTH = 8;
    export const DATE_TIME_LENGTH: number;
    export const SECOND = 1000;
    export const SECONDS_IN_MINUTE = 60;
    export const MINUTE: number;
    export const MINUTES_IN_HOUR = 60;
    export const HOUR: number;
    export const HOURS_IN_DAY = 24;
    export const DAY: number;
    export const DAYS_IN_WEEK = 7;
    export const WEEK: number;
    export const DAYS_IN_MONTH = 28;
    export const MONTH: number;
    export const WEEKS_IN_YEAR = 52;
    export const DAYS_IN_YEAR: number;
    export const SUNDAY = 0;
    export const MONDAY = 1;
    export const TUESDAY = 2;
    export const WEDNESDAY = 3;
    export const THURSDAY = 4;
    export const FRIDAY = 5;
    export const SATURDAY = 6;
}
declare module "keyboard" {
    export const KeyboardKey: {
        ESCAPE: string;
        SHIFT: string;
        ALT: string;
        CTRL: string;
        ARROW_LEFT: string;
        ARROW_RIGHT: string;
        NUM0: string;
        NUM1: string;
        NUM2: string;
        NUM3: string;
        NUM4: string;
        NUM5: string;
        NUM6: string;
        NUM7: string;
        NUM8: string;
        NUM9: string;
        PLUS: string;
        MINUS: string;
        E: string;
    };
    export const KeyboardCode: {
        ESCAPE: number;
        SHIFT: number;
        CTRL: number;
        ALT: number;
        NUM0: number;
        NUM1: number;
        NUM2: number;
        NUM3: number;
        NUM4: number;
        NUM5: number;
        NUM6: number;
        NUM7: number;
        NUM8: number;
        NUM9: number;
        META: number;
        C: number;
    };
}
declare module "op" {
    export type OpState = {
        name: string;
        isDefault?: boolean;
        isPending?: boolean;
        isOk?: boolean;
        isError?: boolean;
        isResolved?: boolean;
    };
    export const OpStates: Record<string, OpState>;
    export const findOpStateByName: (name: string, defaultOp?: OpState) => OpState;
    export const runOp: <TResult>(state: {
        value: OpState;
    }, callback: () => Promise<TResult>) => Promise<TResult | undefined>;
}
declare module "order-by" {
    export type Selector<T> = (it: T) => unknown;
    export const ASC = 1;
    export const DESC = -1;
    export const orderBy: <T>(iterable: Iterable<T>, selector?: Selector<T>) => T[];
    export const orderByDescending: <T>(iterable: Iterable<T>, selector?: Selector<T>) => T[];
}
declare module "index" {
    export * from "constants";
    export * from "callbacks";
    export * from "size";
    export * from "date";
    export * from "keyboard";
    export * from "op";
    export * from "order-by";
}
