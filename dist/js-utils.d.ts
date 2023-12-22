import dayjs from 'dayjs';

declare function cacheWithObject(storage: any, key: any, callback: any): any;
declare function cacheWithMap(storage: any, key: any, callback: any): any;

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
declare function flushDefers(defers: (() => void)[]): void;
declare function sleep(ms: number, onLog?: (message: unknown) => void): Promise<unknown>;
declare function loopCallback(key: string, callback: () => Promise<any>, firstInterval: number, nextInterval?: number): void;
declare function promises(keyToPromise: Record<string, Promise<unknown>>): Promise<{}>;

declare const UNSET: Readonly<{}>;
declare const OBJECT: any;
declare const JSON_OBJECT: string;
declare const ARRAY: readonly any[];
declare const JSON_ARRAY: string;
declare const FOREVER = true;
declare const MAX_PERCENTAGE = 100;
declare const KB = 1024;
declare const MB: number;
declare const GB: number;
declare const TB: number;
declare const PB: number;

type CountryKey = string;
type CountryModel = {
    key: CountryKey;
    iso2: string;
    titleEn: string;
    titlePreciseEn: string;
    titleRu: string;
    titlePreciseRu: string;
    flagUrl: string;
    flagData?: string;
    isComposite?: true;
    isTotal?: true;
    isOther?: true;
    isUnknown?: true;
};
declare const lcTitleToCountry: Record<string, CountryModel>;
declare const keyToCountry: Record<CountryKey, CountryModel>;
declare function getCountryKeyByTitleOwner(item: {
    country: string;
}): string;
declare function getCountryByKey(countryKey: CountryKey): CountryModel;

declare const TIMEZONE = "Europe/Moscow";
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
type DateModel = dayjs.Dayjs;
type DayKey = number;
type DateKey = string;
type TimeKey = string;
type DateTimeKey = string;
type DateToDay = (date: DateKey) => DayKey;
type DayToDate = (day: DayKey) => DateKey;
declare const now: () => DateModel;
declare const ms: (ms: number) => DateModel;
declare const at: (at: string) => DateModel;
declare const isValidMs: (at: string) => boolean;
declare const isValidAt: (at: string) => boolean;
declare const isValidDate: (at: string) => boolean;
declare function guessDateModel(dayOfMonth: any, month: any, futureModel: any): DateModel | undefined;
declare const getDateFromDateTime: (date: DateTimeKey) => DateKey;
declare function convertTimeToSeconds(time: any): any;
declare const compareTime: (time: any, otherTime: any) => number;
declare function withPreviousYear(at: DateTimeKey): DateTimeKey;
declare function withCustomYear(at: DateTimeKey, customYear: number): DateTimeKey;
declare function incrementYear(at: DateTimeKey, yearIncrement: number): DateTimeKey;
declare function roundDate(dateModel: DateModel, factor: number, onRound?: (x: number) => number): DateModel;
declare function formatDateTime(date: DateModel, withMs?: boolean, defaultValue?: any): any;
declare function formatDateTimeForHumans(date: any, withMs?: boolean, defaultValue?: string): string;
declare function formatDate(dateModel: any, defaultValue?: string): string;
declare function formatDateForHumans(dateModel: any, defaultValue?: string): string;
declare function formatDayForHumans(date: any, defaultValue?: string): string;
declare function formatTime(dateModel: any, withMs?: boolean, defaultValue?: string): string;
declare function formatTimeSpan(totalMs: any, withMs?: boolean, defaultValue?: string): string;
declare function humanizeDuration(totalDays: number, maxAge: number): string;
declare function getIfNotEpoch(at: string): string | undefined;

type DecoratorProps = {
    kind: string;
    name: string;
    addInitializer: (VoidFunction: any) => void;
};
type DecoratorFunction = (target: any, props: DecoratorProps) => unknown | void;

declare function bound(): DecoratorFunction;
declare function boundTS(): (classOrPrototype: any, propertyKey: string, descriptor: any) => void;
declare function boundClassTS(): <TConstructor extends new (...args: any[]) => object>(Target: TConstructor) => {
    new (...args: any[]): {};
} & TConstructor;

interface Cached {
    (...args: unknown[]): unknown;
    hasResult(): boolean;
    invalidate(): void;
}
declare function cached(): DecoratorFunction;
declare function cachedTS(): (classOrPrototype: any, propertyKey: string, descriptor: any) => void;

interface Synchronized {
    (...args: unknown[]): unknown;
    isPending(): boolean;
    invalidate(): void;
}
declare function synchronized(): DecoratorFunction;
declare function synchronizedTS(): (classOrPrototype: any, propertyKey: string, descriptor: any) => void;

declare function parseSimpleCsv<TItem = string>(csv: unknown, map?: (value: string) => TItem): TItem[];
declare function stringifySimpleCsv(values: unknown[]): string;
declare function parseJSON<TValue>(jsonString: string, defaultValue?: TValue | undefined): any;
declare function pipeJSON(value: unknown): unknown;
declare const isWorse: (pos?: number, otherPos?: number) => boolean;
declare const notWorse: (pos?: number, otherPos?: number) => boolean;
declare const isBetter: (pos?: number, otherPos?: number) => boolean;
declare const notBetter: (pos?: number, otherPos?: number) => boolean;

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

declare function booleanMapToArray(index: Record<string, boolean>, value?: boolean): string[];
declare function arrayToBooleanMap(array: string[], value?: boolean): {
    [k: string]: boolean;
};
declare function toggleBooleanMap(index: Record<string, boolean>, key: any): Record<string, boolean>;
declare function takeMapItem<T>(index: Record<string, T>, key: string): T;
declare function toggleArrayValue<TValue>(values: TValue[], value: TValue): boolean;
declare function isActiveArrayValue<TValue>(values: TValue[], value: TValue, activeIfEmpty?: boolean): boolean;
declare function arrayToOrderMap(array: unknown[]): Record<string, number>;
declare function sequenceToValuesWithCount(sequence: unknown[]): Array<{
    value: unknown;
    count: number;
}>;
declare function getValuesWithCountLog(valuesWithCount: Array<{
    value: unknown;
    count: number;
}>): string[];
declare function setIndexMapValue(index: Map<unknown, any>, keys: unknown[], value: unknown): boolean;
declare function getIndexMapValue(index: Map<unknown, any>, keys: unknown[], defaultValue?: any): unknown;
declare function removeIndexMapValue(index: Map<unknown, any>, keys: unknown[], value?: unknown): boolean;

declare function getNominativeMaleOrder(value: number): string;
declare function getGenitiveFemaleOrder(value: number): string;
declare function getAccusativeFemaleOrder(value: number, orderValues: [string, string, string]): string;
declare function formatSize(size: any, sizeFactor?: number): string;
declare function formatNumber(number: unknown, fractionDigits?: number, decimalPoint?: string, thousandSeparator?: string, defaultValue?: string): string;
declare function roundNumber(number: number, factor: number, onRound?: (x: number) => number): number;
declare function roundDecimalNumber(number: number, precision: number, onRound?: (x: number) => number): number | undefined;
declare function getPercentage(thisValue: any, prevValue: any): number | undefined;
declare function getPercentageDecimals(percentage: any): 1 | 0;
declare function formatPercentage(percentage: any): string;
type GetNumber<TItem> = (item: TItem) => number;
declare function calcAsc<TItem>(a: TItem, b: TItem, getValue?: GetNumber<TItem>): number;
declare function calcDesc<TItem>(a: TItem, b: TItem, getValue?: GetNumber<TItem>): number;
declare function compareAsc<TItem>(getValue?: GetNumber<TItem>): (a: TItem, b: TItem) => number;
declare function compareDesc<TItem>(getValue?: GetNumber<TItem>): (a: TItem, b: TItem) => number;

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

export { ARRAY, ASC, Cached, CountryKey, CountryModel, DATE_LENGTH, DATE_TIME_LENGTH, DAY, DAYS_IN_MONTH, DAYS_IN_WEEK, DAYS_IN_YEAR, DESC, DateKey, DateModel, DateTimeKey, DateToDay, DayKey, DayToDate, FOREVER, FRIDAY, GB, GET_ARRAY, GET_OBJECT, GetNumber, HAS_ITEMS, HOUR, HOURS_IN_DAY, IDENTITIES, IDENTITY, JSON_ARRAY, JSON_OBJECT, KB, KeyboardCode, KeyboardKey, MAX_PERCENTAGE, MB, MINUTE, MINUTES_IN_HOUR, MONDAY, MONTH, NO, NOOP, OBJECT, OpState, OpStates, PB, SATURDAY, SECOND, SECONDS_IN_MINUTE, SET_FILTER, SORT_NUMBER, SUNDAY, Selector, Synchronized, TB, THURSDAY, TIMEZONE, TIME_LENGTH, TOGGLE, TO_NUMBER, TUESDAY, TimeKey, UNIQUE, UNSET, WEDNESDAY, WEEK, WEEKS_IN_YEAR, YES, arrayToBooleanMap, arrayToOrderMap, at, booleanMapToArray, bound, boundClassTS, boundTS, cacheWithMap, cacheWithObject, cached, cachedTS, calcAsc, calcDesc, compareAsc, compareDesc, compareTime, convertTimeToSeconds, findOpStateByName, flushDefers, formatDate, formatDateForHumans, formatDateTime, formatDateTimeForHumans, formatDayForHumans, formatNumber, formatPercentage, formatSize, formatTime, formatTimeSpan, getAccusativeFemaleOrder, getCountryByKey, getCountryKeyByTitleOwner, getDateFromDateTime, getGenitiveFemaleOrder, getIfNotEpoch, getIndexMapValue, getNominativeMaleOrder, getPercentage, getPercentageDecimals, getValuesWithCountLog, guessDateModel, humanizeDuration, incrementYear, isActiveArrayValue, isBetter, isValidAt, isValidDate, isValidMs, isWorse, keyToCountry, lcTitleToCountry, loopCallback, ms, notBetter, notWorse, now, orderBy, orderByDescending, parseJSON, parseSimpleCsv, pipeJSON, promises, removeIndexMapValue, roundDate, roundDecimalNumber, roundNumber, runOp, sequenceToValuesWithCount, setIndexMapValue, sleep, stringifySimpleCsv, synchronized, synchronizedTS, takeMapItem, toggleArrayValue, toggleBooleanMap, withCustomYear, withPreviousYear };
