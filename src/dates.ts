import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

import {boundClassTS} from './decorators';

export const TIMEZONE = `Europe/Moscow`;

export const DATE_LENGTH = 10
export const TIME_LENGTH = 8
export const DATE_TIME_LENGTH = DATE_LENGTH + 1 + TIME_LENGTH

export const SECOND = 1000
export const SECONDS_IN_MINUTE = 60
export const MINUTE = SECOND * SECONDS_IN_MINUTE
export const MINUTES_IN_HOUR = 60
export const HOUR = MINUTE * MINUTES_IN_HOUR
export const HOURS_IN_DAY = 24
export const DAY = HOURS_IN_DAY * HOUR
export const DAYS_IN_WEEK = 7
export const WEEK = DAYS_IN_WEEK * DAY
export const DAYS_IN_MONTH = 28
export const MONTH = DAYS_IN_MONTH * DAY
export const WEEKS_IN_YEAR = 52
export const DAYS_IN_YEAR = WEEKS_IN_YEAR * DAYS_IN_WEEK

export const SUNDAY = 0
export const MONDAY = 1
export const TUESDAY = 2
export const WEDNESDAY = 3
export const THURSDAY = 4
export const FRIDAY = 5
export const SATURDAY = 6

const DAYS = [`вск`, `пнд`, `втр`, `срд`, `чтв`, `птн`, `сбт`]

export type DateModel = dayjs.Dayjs;
export type DayKey = number;
export type DateKey = string;
export type TimeKey = string;
export type DateTimeKey = string;
export type DateToDay = (date: DateKey) => DayKey;
export type DayToDate = (day: DayKey) => DateKey;

@boundClassTS()
class DateService {
  shouldCache = false;
  atCache = new Map<string, DateModel>();
  msCache = new Map<number, DateModel>();

  toggleCache(force = !this.shouldCache) {
    this.clearCache();
    this.shouldCache = force;
  }

  clearCache() {
    if (this.shouldCache) {
      this.msCache.clear();
      this.atCache.clear();
    }
  }

  now(): DateModel {
    return dayjs().tz(TIMEZONE);
  }

  ms(ms: number): DateModel {
    if (this.shouldCache && this.msCache.has(ms)) {
      return this.msCache.get(ms)!;
    }
    const model = dayjs(ms, TIMEZONE);
    if (this.shouldCache) {
      this.msCache.set(ms, model);
    }
    return model;
  }

  at(at: string): DateModel {
    if (this.shouldCache && this.atCache.has(at)) {
      return this.atCache.get(at)!;
    }
    const model = dayjs(at, TIMEZONE);
    if (this.shouldCache) {
      this.atCache.set(at, model);
    }
    return model;
  }

  isValidMs(at: string): boolean {
    return formatDateTime(this.at(at), true) === at;
  }

  isValidAt(at: string): boolean {
    return formatDateTime(this.at(at)) === at;
  }

  isValidDate(at: string): boolean {
    return formatDate(this.at(at)) === at;
  }
}

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.tz.setDefault(TIMEZONE);

const dateService = new DateService();

export default dateService;

export const now = dateService.now;
export const ms = dateService.ms;
export const at = dateService.at;
export const isValidMs = dateService.isValidMs;
export const isValidAt = dateService.isValidAt;
export const isValidDate = dateService.isValidDate;

export function guessDateModel(dayOfMonth, month, futureModel): DateModel | undefined {
  const guessedAt = `${futureModel.year()}-${String(month).padStart(2, `0`)}-${String(dayOfMonth).padStart(2, `0`)}`;
  let guessedModel = at(guessedAt);
  if (!guessedModel.isValid() || formatDate(guessedModel) !== guessedAt) {
    return undefined;
  }
  while (guessedModel.diff(futureModel) > 0) {
    guessedModel = guessedModel.subtract(1, `year`);
  }
  return guessedModel;
}

const isValid = (dateModel) => dateModel && dateModel.isValid()

export const getDateFromDateTime = (date: DateTimeKey): DateKey => date.slice(0, 10)

export function convertTimeToSeconds(time) {
  const [hour, minute, second] = time.split(`:`)
  return hour * SECONDS_IN_MINUTE * MINUTES_IN_HOUR
    + minute * SECONDS_IN_MINUTE + second
}
export const compareTime = (time, otherTime) => convertTimeToSeconds(time) - convertTimeToSeconds(otherTime)

export function withPreviousYear(at: DateTimeKey): DateTimeKey {
  return (Number(at.slice(0, 4)) - 1) + at.slice(4)
}

export function withCustomYear(at: DateTimeKey, customYear: number): DateTimeKey {
  return String(customYear) + at.slice(4)
}

export function incrementYear(at: DateTimeKey, yearIncrement: number): DateTimeKey {
  const year = Number(at.slice(0, 4))
  if (!year) {
    return at
  }
  return withCustomYear(at, year + yearIncrement)
}

export function roundDate(dateModel: DateModel, factor: number, onRound = Math.round): DateModel {
  return ms(onRound(dateModel.valueOf() / factor) * factor)
}

export function formatDateTime(date: DateModel, withMs = false, defaultValue: any = `-`) {
  if (!isValid(date)) {
    return defaultValue
  }
  return date.year()
    + `-` + (date.month() + 1).toString().padStart(2, `0`)
    + `-` + date.date().toString().padStart(2, `0`)
    + ` ` + date.hour().toString().padStart(2, `0`)
    + `:` + date.minute().toString().padStart(2, `0`)
    + `:` + date.second().toString().padStart(2, `0`)
    + (withMs ? (`.` + date.millisecond().toString().padStart(3, `0`)) : ``)
}

export function formatDateTimeForHumans(date, withMs = false, defaultValue = `-`) {
  if (!isValid(date)) {
    return defaultValue
  }
  return `${formatDateForHumans(date)} ${formatTime(date, withMs)}`
}

export function formatDate(dateModel, defaultValue = `-`) {
  if (!isValid(dateModel)) {
    return defaultValue
  }
  return dateModel.year().toString()
    + `-` + (dateModel.month() + 1).toString().padStart(2, `0`)
    + `-` + dateModel.date().toString().padStart(2, `0`)
}

export function formatDateForHumans(dateModel, defaultValue = `-`) {
  if (!isValid(dateModel)) {
    return defaultValue
  }
  const day = dateModel.date()
  const month = dateModel.month() + 1
  const year = dateModel.year()
  return `${day}.${month}.${year}`
}

export function formatDayForHumans(date, defaultValue = `-`) {
  if (!isValid(date)) {
    return defaultValue
  }
  return DAYS[date.day()]
}

export function formatTime(dateModel, withMs = false, defaultValue = `-`) {
  if (!isValid(dateModel)) {
    return defaultValue
  }
  return dateModel.hour().toString().padStart(2, `0`)
    + `:` + dateModel.minute().toString().padStart(2, `0`)
    + `:` + dateModel.second().toString().padStart(2, `0`)
    + (withMs ? (`.` + dateModel.millisecond().toString().padStart(3, `0`)) : ``)
}

export function formatTimeSpan(totalMs, withMs = false, defaultValue = `-`) {
  if (!totalMs) {
    return defaultValue
  }
  const currentMs = Math.floor(totalMs % SECOND)
  const totalSeconds = Math.floor(totalMs / SECOND)
  const seconds = totalSeconds % SECONDS_IN_MINUTE
  const totalMinutes = Math.floor(totalSeconds / SECONDS_IN_MINUTE)
  const minutes = totalMinutes % MINUTES_IN_HOUR
  const totalHours = Math.floor(totalMinutes / MINUTES_IN_HOUR)

  return totalHours.toString().padStart(2, `0`)
    + `:` + minutes.toString().padStart(2, `0`)
    + `:` + seconds.toString().padStart(2, `0`)
    + (withMs ? (`.` + currentMs.toString().padStart(3, `0`)) : ``)
}

export function humanizeDuration(totalDays: number, maxAge: number) {
  if (totalDays === 0 || totalDays >= maxAge) {
    return `-`
  }
  const weeks = Math.floor(totalDays / DAYS_IN_WEEK)
  if (weeks > 0) {
    return `${weeks}w`
  }
  const days = totalDays % DAYS_IN_WEEK
  return `${days}d`
}

export function getIfNotEpoch(at: string): string | undefined {
  return at !== `1970-01-01 03:00:00` && at !== `1970-01-01 03:00:00.000`
    ? at
    : undefined
}

Object.assign(global, {now, ms, at, isValidMs, isValidAt, isValidDate, guessDateModel, formatDate, formatDateTime});
