declare const UNSET: Readonly<{}>;
declare const OBJECT: any;
declare const JSON_OBJECT: string;
declare const ARRAY: readonly any[];
declare const JSON_ARRAY: string;
declare const FOREVER = true;
declare const MAX_PERCENTAGE = 100;

declare const NOOP: (_?: unknown) => undefined;
declare const YES: () => boolean;
declare const NO: () => boolean;
declare const TOGGLE: (v: any) => boolean;
declare const GET_ARRAY: () => readonly any[];
declare const GET_OBJECT: () => any;
declare const IDENTITY: (v: any) => any;
declare const IDENTITIES: (...v: any[]) => any[];
declare const HAS_ITEMS: (v: unknown[]) => boolean;
declare const SET_FILTER: (item: any, index: any, array: any) => boolean;
declare const SORT_NUMBER: (number: any, otherNumber: any) => number;
declare const TO_NUMBER: (value: any) => number | undefined;
declare const UNIQUE: <TItem>(array: readonly TItem[]) => TItem[];

declare const KB = 1024;
declare const MB: number;
declare const GB: number;
declare const TB: number;
declare const PB: number;

declare const DATE_LENGTH = 10;
declare const TIME_LENGTH = 8;
declare const DATE_TIME_LENGTH: number;
declare const SECOND = 1000;
declare const SECONDS_IN_MINUTE = 60;
declare const MINUTE: number;
declare const MINUTES_IN_HOUR = 60;
declare const HOUR: number;
declare const HOURS_IN_DAY = 24;
declare const DAY: number;
declare const DAYS_IN_WEEK = 7;
declare const WEEK: number;
declare const DAYS_IN_MONTH = 28;
declare const MONTH: number;
declare const WEEKS_IN_YEAR = 52;
declare const DAYS_IN_YEAR: number;
declare const SUNDAY = 0;
declare const MONDAY = 1;
declare const TUESDAY = 2;
declare const WEDNESDAY = 3;
declare const THURSDAY = 4;
declare const FRIDAY = 5;
declare const SATURDAY = 6;

declare const KeyboardKey: {
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
declare const KeyboardCode: {
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

type OpState = {
    name: string;
    isDefault?: boolean;
    isPending?: boolean;
    isOk?: boolean;
    isError?: boolean;
    isResolved?: boolean;
};
declare const OpStates: Record<string, OpState>;
declare const findOpStateByName: (name: string, defaultOp?: OpState) => OpState;
declare const runOp: <TResult>(state: {
    value: OpState;
}, callback: () => Promise<TResult>) => Promise<TResult | undefined>;

type Selector<T> = (it: T) => unknown;
declare const ASC = 1;
declare const DESC = -1;
declare const orderBy: <T>(iterable: Iterable<T>, selector?: Selector<T>) => T[];
declare const orderByDescending: <T>(iterable: Iterable<T>, selector?: Selector<T>) => T[];

export { ARRAY, ASC, DATE_LENGTH, DATE_TIME_LENGTH, DAY, DAYS_IN_MONTH, DAYS_IN_WEEK, DAYS_IN_YEAR, DESC, FOREVER, FRIDAY, GB, GET_ARRAY, GET_OBJECT, HAS_ITEMS, HOUR, HOURS_IN_DAY, IDENTITIES, IDENTITY, JSON_ARRAY, JSON_OBJECT, KB, KeyboardCode, KeyboardKey, MAX_PERCENTAGE, MB, MINUTE, MINUTES_IN_HOUR, MONDAY, MONTH, NO, NOOP, OBJECT, OpState, OpStates, PB, SATURDAY, SECOND, SECONDS_IN_MINUTE, SET_FILTER, SORT_NUMBER, SUNDAY, Selector, TB, THURSDAY, TIME_LENGTH, TOGGLE, TO_NUMBER, TUESDAY, UNIQUE, UNSET, WEDNESDAY, WEEK, WEEKS_IN_YEAR, YES, findOpStateByName, orderBy, orderByDescending, runOp };
