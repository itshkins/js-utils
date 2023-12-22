var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};

// src/caches.ts
function cacheWithObject(storage, key, callback) {
  if (key in storage) {
    return storage[key];
  }
  storage[key] = callback();
  return storage[key];
}
function cacheWithMap(storage, key, callback) {
  if (storage.has(key)) {
    return storage.get(key);
  }
  storage.set(key, callback());
  return storage.get(key);
}

// src/constants.ts
var UNSET = Object.freeze({});
var OBJECT = Object.freeze({});
var JSON_OBJECT = JSON.stringify(OBJECT);
var ARRAY = Object.freeze([]);
var JSON_ARRAY = JSON.stringify(ARRAY);
var FOREVER = true;
var MAX_PERCENTAGE = 100;
var KB = 1024;
var MB = 1024 * KB;
var GB = 1024 * MB;
var TB = 1024 * GB;
var PB = 1024 * TB;

// src/dates.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

// src/decorators/decorator-helpers.ts
function bind(object, method) {
  return object[method].bind(object);
}
function getMethodKeys(target) {
  if (typeof Reflect !== `undefined` && typeof Reflect.ownKeys === `function`) {
    return Reflect.ownKeys(target.prototype);
  }
  const keys = Object.getOwnPropertyNames(target.prototype);
  if (typeof Object.getOwnPropertySymbols === `function`) {
    keys.push(...Object.getOwnPropertySymbols(target.prototype));
  }
  return keys;
}
function defineDecorator(kindToDecorate) {
  return (target, props) => {
    const decorate = kindToDecorate[props.kind] ?? NOOP;
    return decorate(target, props);
  };
}
function defineMethodDecorator(onInitialize) {
  return defineDecorator({
    method: (_, { name, addInitializer }) => {
      addInitializer(function() {
        Object.defineProperty(this, name, { value: onInitialize(this, name, this[name]) });
      });
    },
    class: (Target) => {
      const names = getMethodKeys(Target);
      return class extends Target {
        constructor(...args) {
          super(...args);
          for (const name of names) {
            Object.defineProperty(this, name, { value: onInitialize(this, name, this[name]) });
          }
        }
      };
    }
  });
}
function decorateMethodTS(doDecorate, context, propertyKey, value) {
  const newValue = doDecorate(context, propertyKey, value);
  Object.defineProperty(context, propertyKey, {
    value: newValue,
    configurable: true
  });
  return newValue;
}
function defineMethodDecoratorTS(doDecorate) {
  return (classOrPrototype, propertyKey, previousDescriptor) => {
    function get() {
      const descriptor = Object.getOwnPropertyDescriptor(classOrPrototype, propertyKey);
      if (descriptor.value) {
        return decorateMethodTS(doDecorate, this, propertyKey, this[propertyKey]);
      }
      if (descriptor.get !== get) {
        return decorateMethodTS(doDecorate, this, propertyKey, this[propertyKey]);
      }
      if (previousDescriptor.value) {
        return decorateMethodTS(doDecorate, this, propertyKey, previousDescriptor.value);
      }
      if (previousDescriptor.get) {
        Object.defineProperty(classOrPrototype, propertyKey, previousDescriptor);
        return decorateMethodTS(doDecorate, this, propertyKey, previousDescriptor.get.call(this));
      }
      throw new Error(`createMethodDecorator: unexpected state`);
    }
    return { get };
  };
}

// src/decorators/bound-decorators.ts
function bound() {
  return defineMethodDecorator(bind);
}
function boundTS() {
  return defineMethodDecoratorTS(bind);
}
function boundClassTS() {
  return function(Target) {
    const names = getMethodKeys(Target);
    return class extends Target {
      constructor(...args) {
        super(...args);
        for (const name of names) {
          Object.defineProperty(this, name, { value: bind(this, name) });
        }
      }
    };
  };
}

// src/decorators/cached-decorators.ts
var UNDEFINED = Symbol(`UNDEFINED`);
function createCached(object, key, value = object[key]) {
  const callback = value.bind(object);
  let result = UNDEFINED;
  const decorated = {
    [key](...args) {
      if (result === UNDEFINED) {
        result = callback(...args);
      }
      return result;
    }
  }[key];
  decorated.hasResult = () => result !== UNDEFINED;
  decorated.invalidate = () => {
    result = UNDEFINED;
  };
  return decorated;
}
function cached() {
  return defineMethodDecorator((object, key) => createCached(object, object[key]));
}
function cachedTS() {
  return defineMethodDecoratorTS((object, key, value) => createCached(object, key, value));
}

// src/decorators/synchronized-decorators.ts
function createCached2(object, key, value = object[key]) {
  const callback = value.bind(object);
  let promise;
  const decorated = {
    [key](...args) {
      if (!promise) {
        promise = callback(...args).finally(() => {
          promise = void 0;
        });
      }
      return promise;
    }
  }[key];
  decorated.isPending = () => promise !== void 0;
  decorated.invalidate = () => {
    promise = void 0;
  };
  return decorated;
}
function synchronized() {
  return defineMethodDecorator((object, key) => createCached2(object, object[key]));
}
function synchronizedTS() {
  return defineMethodDecoratorTS((object, key, value) => createCached2(object, key, value));
}

// src/dates.ts
var TIMEZONE = `Europe/Moscow`;
var DATE_LENGTH = 10;
var TIME_LENGTH = 8;
var DATE_TIME_LENGTH = DATE_LENGTH + 1 + TIME_LENGTH;
var SECOND = 1e3;
var SECONDS_IN_MINUTE = 60;
var MINUTE = SECOND * SECONDS_IN_MINUTE;
var MINUTES_IN_HOUR = 60;
var HOUR = MINUTE * MINUTES_IN_HOUR;
var HOURS_IN_DAY = 24;
var DAY = HOURS_IN_DAY * HOUR;
var DAYS_IN_WEEK = 7;
var WEEK = DAYS_IN_WEEK * DAY;
var DAYS_IN_MONTH = 28;
var MONTH = DAYS_IN_MONTH * DAY;
var WEEKS_IN_YEAR = 52;
var DAYS_IN_YEAR = WEEKS_IN_YEAR * DAYS_IN_WEEK;
var SUNDAY = 0;
var MONDAY = 1;
var TUESDAY = 2;
var WEDNESDAY = 3;
var THURSDAY = 4;
var FRIDAY = 5;
var SATURDAY = 6;
var DAYS = [`\u0432\u0441\u043A`, `\u043F\u043D\u0434`, `\u0432\u0442\u0440`, `\u0441\u0440\u0434`, `\u0447\u0442\u0432`, `\u043F\u0442\u043D`, `\u0441\u0431\u0442`];
var DateService = class {
  shouldCache = false;
  atCache = /* @__PURE__ */ new Map();
  msCache = /* @__PURE__ */ new Map();
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
  now() {
    return dayjs().tz(TIMEZONE);
  }
  ms(ms2) {
    if (this.shouldCache && this.msCache.has(ms2)) {
      return this.msCache.get(ms2);
    }
    const model = dayjs(ms2, TIMEZONE);
    if (this.shouldCache) {
      this.msCache.set(ms2, model);
    }
    return model;
  }
  at(at2) {
    if (this.shouldCache && this.atCache.has(at2)) {
      return this.atCache.get(at2);
    }
    const model = dayjs(at2, TIMEZONE);
    if (this.shouldCache) {
      this.atCache.set(at2, model);
    }
    return model;
  }
  isValidMs(at2) {
    return formatDateTime(this.at(at2), true) === at2;
  }
  isValidAt(at2) {
    return formatDateTime(this.at(at2)) === at2;
  }
  isValidDate(at2) {
    return formatDate(this.at(at2)) === at2;
  }
};
DateService = __decorateClass([
  boundClassTS()
], DateService);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.tz.setDefault(TIMEZONE);
var dateService = new DateService();
var now = dateService.now;
var ms = dateService.ms;
var at = dateService.at;
var isValidMs = dateService.isValidMs;
var isValidAt = dateService.isValidAt;
var isValidDate = dateService.isValidDate;
function guessDateModel(dayOfMonth, month, futureModel) {
  const guessedAt = `${futureModel.year()}-${String(month).padStart(2, `0`)}-${String(dayOfMonth).padStart(2, `0`)}`;
  let guessedModel = at(guessedAt);
  if (!guessedModel.isValid() || formatDate(guessedModel) !== guessedAt) {
    return void 0;
  }
  while (guessedModel.diff(futureModel) > 0) {
    guessedModel = guessedModel.subtract(1, `year`);
  }
  return guessedModel;
}
var isValid = (dateModel) => dateModel && dateModel.isValid();
var getDateFromDateTime = (date) => date.slice(0, 10);
function convertTimeToSeconds(time) {
  const [hour, minute, second] = time.split(`:`);
  return hour * SECONDS_IN_MINUTE * MINUTES_IN_HOUR + minute * SECONDS_IN_MINUTE + second;
}
var compareTime = (time, otherTime) => convertTimeToSeconds(time) - convertTimeToSeconds(otherTime);
function withPreviousYear(at2) {
  return Number(at2.slice(0, 4)) - 1 + at2.slice(4);
}
function withCustomYear(at2, customYear) {
  return String(customYear) + at2.slice(4);
}
function incrementYear(at2, yearIncrement) {
  const year = Number(at2.slice(0, 4));
  if (!year) {
    return at2;
  }
  return withCustomYear(at2, year + yearIncrement);
}
function roundDate(dateModel, factor, onRound = Math.round) {
  return ms(onRound(dateModel.valueOf() / factor) * factor);
}
function formatDateTime(date, withMs = false, defaultValue = `-`) {
  if (!isValid(date)) {
    return defaultValue;
  }
  return date.year() + `-` + (date.month() + 1).toString().padStart(2, `0`) + `-` + date.date().toString().padStart(2, `0`) + ` ` + date.hour().toString().padStart(2, `0`) + `:` + date.minute().toString().padStart(2, `0`) + `:` + date.second().toString().padStart(2, `0`) + (withMs ? `.` + date.millisecond().toString().padStart(3, `0`) : ``);
}
function formatDateTimeForHumans(date, withMs = false, defaultValue = `-`) {
  if (!isValid(date)) {
    return defaultValue;
  }
  return `${formatDateForHumans(date)} ${formatTime(date, withMs)}`;
}
function formatDate(dateModel, defaultValue = `-`) {
  if (!isValid(dateModel)) {
    return defaultValue;
  }
  return dateModel.year().toString() + `-` + (dateModel.month() + 1).toString().padStart(2, `0`) + `-` + dateModel.date().toString().padStart(2, `0`);
}
function formatDateForHumans(dateModel, defaultValue = `-`) {
  if (!isValid(dateModel)) {
    return defaultValue;
  }
  const day = dateModel.date();
  const month = dateModel.month() + 1;
  const year = dateModel.year();
  return `${day}.${month}.${year}`;
}
function formatDayForHumans(date, defaultValue = `-`) {
  if (!isValid(date)) {
    return defaultValue;
  }
  return DAYS[date.day()];
}
function formatTime(dateModel, withMs = false, defaultValue = `-`) {
  if (!isValid(dateModel)) {
    return defaultValue;
  }
  return dateModel.hour().toString().padStart(2, `0`) + `:` + dateModel.minute().toString().padStart(2, `0`) + `:` + dateModel.second().toString().padStart(2, `0`) + (withMs ? `.` + dateModel.millisecond().toString().padStart(3, `0`) : ``);
}
function formatTimeSpan(totalMs, withMs = false, defaultValue = `-`) {
  if (!totalMs) {
    return defaultValue;
  }
  const currentMs = Math.floor(totalMs % SECOND);
  const totalSeconds = Math.floor(totalMs / SECOND);
  const seconds = totalSeconds % SECONDS_IN_MINUTE;
  const totalMinutes = Math.floor(totalSeconds / SECONDS_IN_MINUTE);
  const minutes = totalMinutes % MINUTES_IN_HOUR;
  const totalHours = Math.floor(totalMinutes / MINUTES_IN_HOUR);
  return totalHours.toString().padStart(2, `0`) + `:` + minutes.toString().padStart(2, `0`) + `:` + seconds.toString().padStart(2, `0`) + (withMs ? `.` + currentMs.toString().padStart(3, `0`) : ``);
}
function humanizeDuration(totalDays, maxAge) {
  if (totalDays === 0 || totalDays >= maxAge) {
    return `-`;
  }
  const weeks = Math.floor(totalDays / DAYS_IN_WEEK);
  if (weeks > 0) {
    return `${weeks}w`;
  }
  const days = totalDays % DAYS_IN_WEEK;
  return `${days}d`;
}
function getIfNotEpoch(at2) {
  return at2 !== `1970-01-01 03:00:00` && at2 !== `1970-01-01 03:00:00.000` ? at2 : void 0;
}
Object.assign(global, { now, ms, at, isValidMs, isValidAt, isValidDate, guessDateModel, formatDate, formatDateTime });

// src/callbacks.ts
var NOOP = (_) => void 0;
var YES = () => true;
var NO = () => false;
var TOGGLE = (v) => !v;
var GET_ARRAY = () => ARRAY;
var GET_OBJECT = () => OBJECT;
var IDENTITY = (v) => v;
var IDENTITIES = (...v) => v;
var HAS_ITEMS = (v) => Array.isArray(v) && v.length !== 0;
var SET_FILTER = (item, index, array) => array.indexOf(item) === index;
var SORT_NUMBER = (number, otherNumber) => number - otherNumber;
var TO_NUMBER = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : void 0;
};
var UNIQUE = (array) => Array.from(new Set(array));
function flushDefers(defers) {
  for (const defer of defers) {
    defer();
  }
  defers.length = 0;
}
async function sleep(ms2, onLog) {
  if (onLog) {
    const aliveAt = formatTime(now().add(ms2), true);
    onLog(`sleep:${formatTimeSpan(ms2, true)} aliveAt:${aliveAt}`);
  }
  return new Promise((resolve) => {
    setTimeout(resolve, ms2);
  });
}
function loopCallback(key, callback, firstInterval, nextInterval = firstInterval) {
  setTimeout(() => {
    callback().catch((e) => {
      console.error(key, e);
    }).finally(() => {
      loopCallback(key, callback, nextInterval);
    });
  }, firstInterval);
}
async function promises(keyToPromise) {
  keyToPromise = { ...keyToPromise };
  const result = {};
  for (const key in keyToPromise) {
    keyToPromise[key] = keyToPromise[key].then((localResult) => {
      result[key] = localResult;
    });
  }
  await Promise.all(Object.values(keyToPromise));
  return result;
}

// src/countries/countries.min.json
var countries_min_default = [{ key: "ab", iso2: "AB", titleEn: "Abkhazia", titlePreciseEn: "Abkhazia", titleRu: "\u0410\u0431\u0445\u0430\u0437\u0438\u044F", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0410\u0431\u0445\u0430\u0437\u0438\u044F", flagUrl: "/flags/ab.png" }, { key: "au", iso2: "AU", titleEn: "Australia", titlePreciseEn: "Australia", titleRu: "\u0410\u0432\u0441\u0442\u0440\u0430\u043B\u0438\u044F", titlePreciseRu: "\u0410\u0432\u0441\u0442\u0440\u0430\u043B\u0438\u044F", flagUrl: "/flags/au.png" }, { key: "at", iso2: "AT", titleEn: "Austria", titlePreciseEn: "Austria", titleRu: "\u0410\u0432\u0441\u0442\u0440\u0438\u044F", titlePreciseRu: "\u0410\u0432\u0441\u0442\u0440\u0438\u0439\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/at.png" }, { key: "az", iso2: "AZ", titleEn: "Azerbaijan", titlePreciseEn: "Azerbaijan", titleRu: "\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043D", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043D", flagUrl: "/flags/az.png" }, { key: "al", iso2: "AL", titleEn: "Albania", titlePreciseEn: "Albania", titleRu: "\u0410\u043B\u0431\u0430\u043D\u0438\u044F", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0410\u043B\u0431\u0430\u043D\u0438\u044F", flagUrl: "/flags/al.png" }, { key: "dz", iso2: "DZ", titleEn: "Algeria", titlePreciseEn: "Algeria", titleRu: "\u0410\u043B\u0436\u0438\u0440", titlePreciseRu: "\u0410\u043B\u0436\u0438\u0440\u0441\u043A\u0430\u044F \u041D\u0430\u0440\u043E\u0434\u043D\u0430\u044F \u0414\u0435\u043C\u043E\u043A\u0440\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/dz.png" }, { key: "as", iso2: "AS", titleEn: "American Samoa", titlePreciseEn: "American Samoa", titleRu: "\u0410\u043C\u0435\u0440\u0438\u043A\u0430\u043D\u0441\u043A\u043E\u0435 \u0421\u0430\u043C\u043E\u0430", titlePreciseRu: "\u0410\u043C\u0435\u0440\u0438\u043A\u0430\u043D\u0441\u043A\u043E\u0435 \u0421\u0430\u043C\u043E\u0430", flagUrl: "/flags/as.png" }, { key: "ai", iso2: "AI", titleEn: "Anguilla", titlePreciseEn: "Anguilla", titleRu: "\u0410\u043D\u0433\u0438\u043B\u044C\u044F", titlePreciseRu: "\u0410\u043D\u0433\u0438\u043B\u044C\u044F", flagUrl: "/flags/ai.png" }, { key: "ao", iso2: "AO", titleEn: "Angola", titlePreciseEn: "Angola", titleRu: "\u0410\u043D\u0433\u043E\u043B\u0430", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0410\u043D\u0433\u043E\u043B\u0430", flagUrl: "/flags/ao.png" }, { key: "ad", iso2: "AD", titleEn: "Andorra", titlePreciseEn: "Andorra", titleRu: "\u0410\u043D\u0434\u043E\u0440\u0440\u0430", titlePreciseRu: "\u041A\u043D\u044F\u0436\u0435\u0441\u0442\u0432\u043E \u0410\u043D\u0434\u043E\u0440\u0440\u0430", flagUrl: "/flags/ad.png" }, { key: "aq", iso2: "AQ", titleEn: "Antarctica", titlePreciseEn: "Antarctica", titleRu: "\u0410\u043D\u0442\u0430\u0440\u043A\u0442\u0438\u0434\u0430", titlePreciseRu: "\u0410\u043D\u0442\u0430\u0440\u043A\u0442\u0438\u0434\u0430", flagUrl: "/flags/aq.png" }, { key: "ag", iso2: "AG", titleEn: "Antigua and Barbuda", titlePreciseEn: "Antigua and Barbuda", titleRu: "\u0410\u043D\u0442\u0438\u0433\u0443\u0430 \u0438 \u0411\u0430\u0440\u0431\u0443\u0434\u0430", titlePreciseRu: "\u0410\u043D\u0442\u0438\u0433\u0443\u0430 \u0438 \u0411\u0430\u0440\u0431\u0443\u0434\u0430", flagUrl: "/flags/ag.png" }, { key: "ar", iso2: "AR", titleEn: "Argentina", titlePreciseEn: "Argentina", titleRu: "\u0410\u0440\u0433\u0435\u043D\u0442\u0438\u043D\u0430", titlePreciseRu: "\u0410\u0440\u0433\u0435\u043D\u0442\u0438\u043D\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/ar.png" }, { key: "am", iso2: "AM", titleEn: "Armenia", titlePreciseEn: "Armenia", titleRu: "\u0410\u0440\u043C\u0435\u043D\u0438\u044F", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0410\u0440\u043C\u0435\u043D\u0438\u044F", flagUrl: "/flags/am.png" }, { key: "aw", iso2: "AW", titleEn: "Aruba", titlePreciseEn: "Aruba", titleRu: "\u0410\u0440\u0443\u0431\u0430", titlePreciseRu: "\u0410\u0440\u0443\u0431\u0430", flagUrl: "/flags/aw.png" }, { key: "af", iso2: "AF", titleEn: "Afghanistan", titlePreciseEn: "Afghanistan", titleRu: "\u0410\u0444\u0433\u0430\u043D\u0438\u0441\u0442\u0430\u043D", titlePreciseRu: "\u041F\u0435\u0440\u0435\u0445\u043E\u0434\u043D\u043E\u0435 \u0418\u0441\u043B\u0430\u043C\u0441\u043A\u043E\u0435 \u0413\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u043E \u0410\u0444\u0433\u0430\u043D\u0438\u0441\u0442\u0430\u043D", flagUrl: "/flags/af.png" }, { key: "bs", iso2: "BS", titleEn: "Bahamas", titlePreciseEn: "Bahamas", titleRu: "\u0411\u0430\u0433\u0430\u043C\u044B", titlePreciseRu: "\u0421\u043E\u0434\u0440\u0443\u0436\u0435\u0441\u0442\u0432\u043E \u0411\u0430\u0433\u0430\u043C\u044B", flagUrl: "/flags/bs.png" }, { key: "bd", iso2: "BD", titleEn: "Bangladesh", titlePreciseEn: "Bangladesh", titleRu: "\u0411\u0430\u043D\u0433\u043B\u0430\u0434\u0435\u0448", titlePreciseRu: "\u041D\u0430\u0440\u043E\u0434\u043D\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0411\u0430\u043D\u0433\u043B\u0430\u0434\u0435\u0448", flagUrl: "/flags/bd.png" }, { key: "bb", iso2: "BB", titleEn: "Barbados", titlePreciseEn: "Barbados", titleRu: "\u0411\u0430\u0440\u0431\u0430\u0434\u043E\u0441", titlePreciseRu: "\u0411\u0430\u0440\u0431\u0430\u0434\u043E\u0441", flagUrl: "/flags/bb.png" }, { key: "bh", iso2: "BH", titleEn: "Bahrain", titlePreciseEn: "Bahrain", titleRu: "\u0411\u0430\u0445\u0440\u0435\u0439\u043D", titlePreciseRu: "\u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u0442\u0432\u043E \u0411\u0430\u0445\u0440\u0435\u0439\u043D", flagUrl: "/flags/bh.png" }, { key: "by", iso2: "BY", titleEn: "Belarus", titlePreciseEn: "Belarus", titleRu: "\u0411\u0435\u043B\u0430\u0440\u0443\u0441\u044C", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0411\u0435\u043B\u0430\u0440\u0443\u0441\u044C", flagUrl: "/flags/by.png" }, { key: "bz", iso2: "BZ", titleEn: "Belize", titlePreciseEn: "Belize", titleRu: "\u0411\u0435\u043B\u0438\u0437", titlePreciseRu: "\u0411\u0435\u043B\u0438\u0437", flagUrl: "/flags/bz.png" }, { key: "be", iso2: "BE", titleEn: "Belgium", titlePreciseEn: "Belgium", titleRu: "\u0411\u0435\u043B\u044C\u0433\u0438\u044F", titlePreciseRu: "\u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u0442\u0432\u043E \u0411\u0435\u043B\u044C\u0433\u0438\u0438", flagUrl: "/flags/be.png" }, { key: "bj", iso2: "BJ", titleEn: "Benin", titlePreciseEn: "Benin", titleRu: "\u0411\u0435\u043D\u0438\u043D", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0411\u0435\u043D\u0438\u043D", flagUrl: "/flags/bj.png" }, { key: "bm", iso2: "BM", titleEn: "Bermuda", titlePreciseEn: "Bermuda", titleRu: "\u0411\u0435\u0440\u043C\u0443\u0434\u044B", titlePreciseRu: "\u0411\u0435\u0440\u043C\u0443\u0434\u044B", flagUrl: "/flags/bm.png" }, { key: "bg", iso2: "BG", titleEn: "Bulgaria", titlePreciseEn: "Bulgaria", titleRu: "\u0411\u043E\u043B\u0433\u0430\u0440\u0438\u044F", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0411\u043E\u043B\u0433\u0430\u0440\u0438\u044F", flagUrl: "/flags/bg.png" }, { key: "bo", iso2: "BO", titleEn: "Bolivia", titlePreciseEn: "Bolivia, plurinational state of", titleRu: "\u0411\u043E\u043B\u0438\u0432\u0438\u044F, \u041C\u043D\u043E\u0433\u043E\u043D\u0430\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0435 \u0413\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u043E", titlePreciseRu: "\u041C\u043D\u043E\u0433\u043E\u043D\u0430\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0435 \u0413\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u043E \u0411\u043E\u043B\u0438\u0432\u0438\u044F", flagUrl: "/flags/bo.png" }, { key: "bq", iso2: "BQ", titleEn: "Bonaire, Sint Eustatius and Saba", titlePreciseEn: "Bonaire, Sint Eustatius and Saba", titleRu: "\u0411\u043E\u043D\u0430\u0439\u0440\u0435, \u0421\u0430\u0431\u0430 \u0438 \u0421\u0438\u043D\u0442-\u042D\u0441\u0442\u0430\u0442\u0438\u0443\u0441", titlePreciseRu: "\u0411\u043E\u043D\u0430\u0439\u0440\u0435, \u0421\u0430\u0431\u0430 \u0438 \u0421\u0438\u043D\u0442-\u042D\u0441\u0442\u0430\u0442\u0438\u0443\u0441", flagUrl: "/flags/bq.png" }, { key: "ba", iso2: "BA", titleEn: "Bosnia and Herzegovina", titlePreciseEn: "Bosnia and Herzegovina", titleRu: "\u0411\u043E\u0441\u043D\u0438\u044F \u0438 \u0413\u0435\u0440\u0446\u0435\u0433\u043E\u0432\u0438\u043D\u0430", titlePreciseRu: "\u0411\u043E\u0441\u043D\u0438\u044F \u0438 \u0413\u0435\u0440\u0446\u0435\u0433\u043E\u0432\u0438\u043D\u0430", flagUrl: "/flags/ba.png" }, { key: "bw", iso2: "BW", titleEn: "Botswana", titlePreciseEn: "Botswana", titleRu: "\u0411\u043E\u0442\u0441\u0432\u0430\u043D\u0430", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0411\u043E\u0442\u0441\u0432\u0430\u043D\u0430", flagUrl: "/flags/bw.png" }, { key: "br", iso2: "BR", titleEn: "Brazil", titlePreciseEn: "Brazil", titleRu: "\u0411\u0440\u0430\u0437\u0438\u043B\u0438\u044F", titlePreciseRu: "\u0424\u0435\u0434\u0435\u0440\u0430\u0442\u0438\u0432\u043D\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0411\u0440\u0430\u0437\u0438\u043B\u0438\u044F", flagUrl: "/flags/br.png" }, { key: "io", iso2: "IO", titleEn: "British Indian Ocean Territory", titlePreciseEn: "British Indian Ocean Territory", titleRu: "\u0411\u0440\u0438\u0442\u0430\u043D\u0441\u043A\u0430\u044F \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u044F \u0432 \u0418\u043D\u0434\u0438\u0439\u0441\u043A\u043E\u043C \u043E\u043A\u0435\u0430\u043D\u0435", titlePreciseRu: "\u0411\u0440\u0438\u0442\u0430\u043D\u0441\u043A\u0430\u044F \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u044F \u0432 \u0418\u043D\u0434\u0438\u0439\u0441\u043A\u043E\u043C \u043E\u043A\u0435\u0430\u043D\u0435", flagUrl: "/flags/io.png" }, { key: "bn", iso2: "BN", titleEn: "Brunei Darussalam", titlePreciseEn: "Brunei Darussalam", titleRu: "\u0411\u0440\u0443\u043D\u0435\u0439-\u0414\u0430\u0440\u0443\u0441\u0441\u0430\u043B\u0430\u043C", titlePreciseRu: "\u0411\u0440\u0443\u043D\u0435\u0439-\u0414\u0430\u0440\u0443\u0441\u0441\u0430\u043B\u0430\u043C", flagUrl: "/flags/bn.png" }, { key: "bf", iso2: "BF", titleEn: "Burkina Faso", titlePreciseEn: "Burkina Faso", titleRu: "\u0411\u0443\u0440\u043A\u0438\u043D\u0430-\u0424\u0430\u0441\u043E", titlePreciseRu: "\u0411\u0443\u0440\u043A\u0438\u043D\u0430-\u0424\u0430\u0441\u043E", flagUrl: "/flags/bf.png" }, { key: "bi", iso2: "BI", titleEn: "Burundi", titlePreciseEn: "Burundi", titleRu: "\u0411\u0443\u0440\u0443\u043D\u0434\u0438", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0411\u0443\u0440\u0443\u043D\u0434\u0438", flagUrl: "/flags/bi.png" }, { key: "bt", iso2: "BT", titleEn: "Bhutan", titlePreciseEn: "Bhutan", titleRu: "\u0411\u0443\u0442\u0430\u043D", titlePreciseRu: "\u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u0442\u0432\u043E \u0411\u0443\u0442\u0430\u043D", flagUrl: "/flags/bt.png" }, { key: "vu", iso2: "VU", titleEn: "Vanuatu", titlePreciseEn: "Vanuatu", titleRu: "\u0412\u0430\u043D\u0443\u0430\u0442\u0443", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0412\u0430\u043D\u0443\u0430\u0442\u0443", flagUrl: "/flags/vu.png" }, { key: "hu", iso2: "HU", titleEn: "Hungary", titlePreciseEn: "Hungary", titleRu: "\u0412\u0435\u043D\u0433\u0440\u0438\u044F", titlePreciseRu: "\u0412\u0435\u043D\u0433\u0435\u0440\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/hu.png" }, { key: "ve", iso2: "VE", titleEn: "Venezuela", titlePreciseEn: "Venezuela", titleRu: "\u0412\u0435\u043D\u0435\u0441\u0443\u044D\u043B\u0430 \u0411\u043E\u043B\u0438\u0432\u0430\u0440\u0438\u0430\u043D\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", titlePreciseRu: "\u0411\u043E\u043B\u0438\u0432\u0430\u0440\u0438\u0439\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0412\u0435\u043D\u0435\u0441\u0443\u044D\u043B\u0430", flagUrl: "/flags/ve.png" }, { key: "vg", iso2: "VG", titleEn: "Virgin Islands (British)", titlePreciseEn: "Virgin Islands, British", titleRu: "\u0412\u0438\u0440\u0433\u0438\u043D\u0441\u043A\u0438\u0435 \u043E\u0441\u0442\u0440\u043E\u0432\u0430, \u0411\u0440\u0438\u0442\u0430\u043D\u0441\u043A\u0438\u0435", titlePreciseRu: "\u0411\u0440\u0438\u0442\u0430\u043D\u0441\u043A\u0438\u0435 \u0412\u0438\u0440\u0433\u0438\u043D\u0441\u043A\u0438\u0435 \u043E\u0441\u0442\u0440\u043E\u0432\u0430", flagUrl: "/flags/vg.png" }, { key: "vi", iso2: "VI", titleEn: "Virgin Islands (U.S.)", titlePreciseEn: "Virgin Islands, U.S.", titleRu: "\u0412\u0438\u0440\u0433\u0438\u043D\u0441\u043A\u0438\u0435 \u043E\u0441\u0442\u0440\u043E\u0432\u0430, \u0421\u0428\u0410", titlePreciseRu: "\u0412\u0438\u0440\u0433\u0438\u043D\u0441\u043A\u0438\u0435 \u043E\u0441\u0442\u0440\u043E\u0432\u0430 \u0421\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u043D\u044B\u0445 \u0428\u0442\u0430\u0442\u043E\u0432", flagUrl: "/flags/vi.png" }, { key: "vn", iso2: "VN", titleEn: "Vietnam", titlePreciseEn: "Vietnam", titleRu: "\u0412\u044C\u0435\u0442\u043D\u0430\u043C", titlePreciseRu: "\u0421\u043E\u0446\u0438\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0412\u044C\u0435\u0442\u043D\u0430\u043C", flagUrl: "/flags/vn.png" }, { key: "ga", iso2: "GA", titleEn: "Gabon", titlePreciseEn: "Gabon", titleRu: "\u0413\u0430\u0431\u043E\u043D", titlePreciseRu: "\u0413\u0430\u0431\u043E\u043D\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/ga.png" }, { key: "ht", iso2: "HT", titleEn: "Haiti", titlePreciseEn: "Haiti", titleRu: "\u0413\u0430\u0438\u0442\u0438", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0413\u0430\u0438\u0442\u0438", flagUrl: "/flags/ht.png" }, { key: "gy", iso2: "GY", titleEn: "Guyana", titlePreciseEn: "Guyana", titleRu: "\u0413\u0430\u0439\u0430\u043D\u0430", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0413\u0430\u0439\u0430\u043D\u0430", flagUrl: "/flags/gy.png" }, { key: "gm", iso2: "GM", titleEn: "Gambia", titlePreciseEn: "Gambia", titleRu: "\u0413\u0430\u043C\u0431\u0438\u044F", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0413\u0430\u043C\u0431\u0438\u044F", flagUrl: "/flags/gm.png" }, { key: "gh", iso2: "GH", titleEn: "Ghana", titlePreciseEn: "Ghana", titleRu: "\u0413\u0430\u043D\u0430", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0413\u0430\u043D\u0430", flagUrl: "/flags/gh.png" }, { key: "gp", iso2: "GP", titleEn: "Guadeloupe", titlePreciseEn: "Guadeloupe", titleRu: "\u0413\u0432\u0430\u0434\u0435\u043B\u0443\u043F\u0430", titlePreciseRu: "\u0413\u0432\u0430\u0434\u0435\u043B\u0443\u043F\u0430", flagUrl: "/flags/gp.png" }, { key: "gt", iso2: "GT", titleEn: "Guatemala", titlePreciseEn: "Guatemala", titleRu: "\u0413\u0432\u0430\u0442\u0435\u043C\u0430\u043B\u0430", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0413\u0432\u0430\u0442\u0435\u043C\u0430\u043B\u0430", flagUrl: "/flags/gt.png" }, { key: "gn", iso2: "GN", titleEn: "Guinea", titlePreciseEn: "Guinea", titleRu: "\u0413\u0432\u0438\u043D\u0435\u044F", titlePreciseRu: "\u0413\u0432\u0438\u043D\u0435\u0439\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/gn.png" }, { key: "gw", iso2: "GW", titleEn: "Guinea-Bissau", titlePreciseEn: "Guinea-Bissau", titleRu: "\u0413\u0432\u0438\u043D\u0435\u044F-\u0411\u0438\u0441\u0430\u0443", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0413\u0432\u0438\u043D\u0435\u044F-\u0411\u0438\u0441\u0430\u0443", flagUrl: "/flags/gw.png" }, { key: "de", iso2: "DE", titleEn: "Germany", titlePreciseEn: "Germany", titleRu: "\u0413\u0435\u0440\u043C\u0430\u043D\u0438\u044F", titlePreciseRu: "\u0424\u0435\u0434\u0435\u0440\u0430\u0442\u0438\u0432\u043D\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0413\u0435\u0440\u043C\u0430\u043D\u0438\u044F", flagUrl: "/flags/de.png" }, { key: "gg", iso2: "GG", titleEn: "Guernsey", titlePreciseEn: "Guernsey", titleRu: "\u0413\u0435\u0440\u043D\u0441\u0438", titlePreciseRu: "\u0413\u0435\u0440\u043D\u0441\u0438", flagUrl: "/flags/gg.png" }, { key: "gi", iso2: "GI", titleEn: "Gibraltar", titlePreciseEn: "Gibraltar", titleRu: "\u0413\u0438\u0431\u0440\u0430\u043B\u0442\u0430\u0440", titlePreciseRu: "\u0413\u0438\u0431\u0440\u0430\u043B\u0442\u0430\u0440", flagUrl: "/flags/gi.png" }, { key: "hn", iso2: "HN", titleEn: "Honduras", titlePreciseEn: "Honduras", titleRu: "\u0413\u043E\u043D\u0434\u0443\u0440\u0430\u0441", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0413\u043E\u043D\u0434\u0443\u0440\u0430\u0441", flagUrl: "/flags/hn.png" }, { key: "hk", iso2: "HK", titleEn: "Hong Kong", titlePreciseEn: "Hong Kong", titleRu: "\u0413\u043E\u043D\u043A\u043E\u043D\u0433", titlePreciseRu: "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0439  \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u0439  \u0440\u0435\u0433\u0438\u043E\u043D \u041A\u0438\u0442\u0430\u044F \u0413\u043E\u043D\u043A\u043E\u043D\u0433", flagUrl: "/flags/hk.png" }, { key: "gd", iso2: "GD", titleEn: "Grenada", titlePreciseEn: "Grenada", titleRu: "\u0413\u0440\u0435\u043D\u0430\u0434\u0430", titlePreciseRu: "\u0413\u0440\u0435\u043D\u0430\u0434\u0430", flagUrl: "/flags/gd.png" }, { key: "gl", iso2: "GL", titleEn: "Greenland", titlePreciseEn: "Greenland", titleRu: "\u0413\u0440\u0435\u043D\u043B\u0430\u043D\u0434\u0438\u044F", titlePreciseRu: "\u0413\u0440\u0435\u043D\u043B\u0430\u043D\u0434\u0438\u044F", flagUrl: "/flags/gl.png" }, { key: "gr", iso2: "GR", titleEn: "Greece", titlePreciseEn: "Greece", titleRu: "\u0413\u0440\u0435\u0446\u0438\u044F", titlePreciseRu: "\u0413\u0440\u0435\u0447\u0435\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/gr.png" }, { key: "ge", iso2: "GE", titleEn: "Georgia", titlePreciseEn: "Georgia", titleRu: "\u0413\u0440\u0443\u0437\u0438\u044F", titlePreciseRu: "\u0413\u0440\u0443\u0437\u0438\u044F", flagUrl: "/flags/ge.png" }, { key: "gu", iso2: "GU", titleEn: "Guam", titlePreciseEn: "Guam", titleRu: "\u0413\u0443\u0430\u043C", titlePreciseRu: "\u0413\u0443\u0430\u043C", flagUrl: "/flags/gu.png" }, { key: "dk", iso2: "DK", titleEn: "Denmark", titlePreciseEn: "Denmark", titleRu: "\u0414\u0430\u043D\u0438\u044F", titlePreciseRu: "\u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u0442\u0432\u043E \u0414\u0430\u043D\u0438\u044F", flagUrl: "/flags/dk.png" }, { key: "je", iso2: "JE", titleEn: "Jersey", titlePreciseEn: "Jersey", titleRu: "\u0414\u0436\u0435\u0440\u0441\u0438", titlePreciseRu: "\u0414\u0436\u0435\u0440\u0441\u0438", flagUrl: "/flags/je.png" }, { key: "dj", iso2: "DJ", titleEn: "Djibouti", titlePreciseEn: "Djibouti", titleRu: "\u0414\u0436\u0438\u0431\u0443\u0442\u0438", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0414\u0436\u0438\u0431\u0443\u0442\u0438", flagUrl: "/flags/dj.png" }, { key: "dm", iso2: "DM", titleEn: "Dominica", titlePreciseEn: "Dominica", titleRu: "\u0414\u043E\u043C\u0438\u043D\u0438\u043A\u0430", titlePreciseRu: "\u0421\u043E\u0434\u0440\u0443\u0436\u0435\u0441\u0442\u0432\u043E \u0414\u043E\u043C\u0438\u043D\u0438\u043A\u0438", flagUrl: "/flags/dm.png" }, { key: "do", iso2: "DO", titleEn: "Dominican Republic", titlePreciseEn: "Dominican Republic", titleRu: "\u0414\u043E\u043C\u0438\u043D\u0438\u043A\u0430\u043D\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", titlePreciseRu: "\u0414\u043E\u043C\u0438\u043D\u0438\u043A\u0430\u043D\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/do.png" }, { key: "eg", iso2: "EG", titleEn: "Egypt", titlePreciseEn: "Egypt", titleRu: "\u0415\u0433\u0438\u043F\u0435\u0442", titlePreciseRu: "\u0410\u0440\u0430\u0431\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0415\u0433\u0438\u043F\u0435\u0442", flagUrl: "/flags/eg.png" }, { key: "zm", iso2: "ZM", titleEn: "Zambia", titlePreciseEn: "Zambia", titleRu: "\u0417\u0430\u043C\u0431\u0438\u044F", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0417\u0430\u043C\u0431\u0438\u044F", flagUrl: "/flags/zm.png" }, { key: "eh", iso2: "EH", titleEn: "Western Sahara", titlePreciseEn: "Western Sahara", titleRu: "\u0417\u0430\u043F\u0430\u0434\u043D\u0430\u044F \u0421\u0430\u0445\u0430\u0440\u0430", titlePreciseRu: "\u0417\u0430\u043F\u0430\u0434\u043D\u0430\u044F \u0421\u0430\u0445\u0430\u0440\u0430", flagUrl: "/flags/eh.png" }, { key: "zw", iso2: "ZW", titleEn: "Zimbabwe", titlePreciseEn: "Zimbabwe", titleRu: "\u0417\u0438\u043C\u0431\u0430\u0431\u0432\u0435", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0417\u0438\u043C\u0431\u0430\u0431\u0432\u0435", flagUrl: "/flags/zw.png" }, { key: "il", iso2: "IL", titleEn: "Israel", titlePreciseEn: "Israel", titleRu: "\u0418\u0437\u0440\u0430\u0438\u043B\u044C", titlePreciseRu: "\u0413\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u043E \u0418\u0437\u0440\u0430\u0438\u043B\u044C", flagUrl: "/flags/il.png" }, { key: "in", iso2: "IN", titleEn: "India", titlePreciseEn: "India", titleRu: "\u0418\u043D\u0434\u0438\u044F", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0418\u043D\u0434\u0438\u044F", flagUrl: "/flags/in.png" }, { key: "id", iso2: "ID", titleEn: "Indonesia", titlePreciseEn: "Indonesia", titleRu: "\u0418\u043D\u0434\u043E\u043D\u0435\u0437\u0438\u044F", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0418\u043D\u0434\u043E\u043D\u0435\u0437\u0438\u044F", flagUrl: "/flags/id.png" }, { key: "jo", iso2: "JO", titleEn: "Jordan", titlePreciseEn: "Jordan", titleRu: "\u0418\u043E\u0440\u0434\u0430\u043D\u0438\u044F", titlePreciseRu: "\u0418\u043E\u0440\u0434\u0430\u043D\u0441\u043A\u043E\u0435 \u0425\u0430\u0448\u0438\u043C\u0438\u0442\u0441\u043A\u043E\u0435 \u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u0442\u0432\u043E", flagUrl: "/flags/jo.png" }, { key: "iq", iso2: "IQ", titleEn: "Iraq", titlePreciseEn: "Iraq", titleRu: "\u0418\u0440\u0430\u043A", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0418\u0440\u0430\u043A", flagUrl: "/flags/iq.png" }, { key: "ir", iso2: "IR", titleEn: "Iran", titlePreciseEn: "Iran", titleRu: "\u0418\u0440\u0430\u043D, \u0418\u0441\u043B\u0430\u043C\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", titlePreciseRu: "\u0418\u0441\u043B\u0430\u043C\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0418\u0440\u0430\u043D", flagUrl: "/flags/ir.png" }, { key: "ie", iso2: "IE", titleEn: "Ireland", titlePreciseEn: "Ireland", titleRu: "\u0418\u0440\u043B\u0430\u043D\u0434\u0438\u044F", titlePreciseRu: "\u0418\u0440\u043B\u0430\u043D\u0434\u0438\u044F", flagUrl: "/flags/ie.png" }, { key: "is", iso2: "IS", titleEn: "Iceland", titlePreciseEn: "Iceland", titleRu: "\u0418\u0441\u043B\u0430\u043D\u0434\u0438\u044F", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0418\u0441\u043B\u0430\u043D\u0434\u0438\u044F", flagUrl: "/flags/is.png" }, { key: "es", iso2: "ES", titleEn: "Spain", titlePreciseEn: "Spain", titleRu: "\u0418\u0441\u043F\u0430\u043D\u0438\u044F", titlePreciseRu: "\u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u0442\u0432\u043E \u0418\u0441\u043F\u0430\u043D\u0438\u044F", flagUrl: "/flags/es.png" }, { key: "it", iso2: "IT", titleEn: "Italy", titlePreciseEn: "Italy", titleRu: "\u0418\u0442\u0430\u043B\u0438\u044F", titlePreciseRu: "\u0418\u0442\u0430\u043B\u044C\u044F\u043D\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/it.png" }, { key: "ye", iso2: "YE", titleEn: "Yemen", titlePreciseEn: "Yemen", titleRu: "\u0419\u0435\u043C\u0435\u043D", titlePreciseRu: "\u0419\u0435\u043C\u0435\u043D\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/ye.png" }, { key: "cv", iso2: "CV", titleEn: "Cabo Verde", titlePreciseEn: "Cape Verde", titleRu: "\u041A\u0430\u0431\u043E-\u0412\u0435\u0440\u0434\u0435", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041A\u0430\u0431\u043E-\u0412\u0435\u0440\u0434\u0435", flagUrl: "/flags/cv.png" }, { key: "kz", iso2: "KZ", titleEn: "Kazakhstan", titlePreciseEn: "Kazakhstan", titleRu: "\u041A\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043D", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041A\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043D", flagUrl: "/flags/kz.png" }, { key: "kh", iso2: "KH", titleEn: "Cambodia", titlePreciseEn: "Cambodia", titleRu: "\u041A\u0430\u043C\u0431\u043E\u0434\u0436\u0430", titlePreciseRu: "\u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u0442\u0432\u043E \u041A\u0430\u043C\u0431\u043E\u0434\u0436\u0430", flagUrl: "/flags/kh.png" }, { key: "cm", iso2: "CM", titleEn: "Cameroon", titlePreciseEn: "Cameroon", titleRu: "\u041A\u0430\u043C\u0435\u0440\u0443\u043D", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041A\u0430\u043C\u0435\u0440\u0443\u043D", flagUrl: "/flags/cm.png" }, { key: "ca", iso2: "CA", titleEn: "Canada", titlePreciseEn: "Canada", titleRu: "\u041A\u0430\u043D\u0430\u0434\u0430", titlePreciseRu: "\u041A\u0430\u043D\u0430\u0434\u0430", flagUrl: "/flags/ca.png" }, { key: "qa", iso2: "QA", titleEn: "Qatar", titlePreciseEn: "Qatar", titleRu: "\u041A\u0430\u0442\u0430\u0440", titlePreciseRu: "\u0413\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u043E \u041A\u0430\u0442\u0430\u0440", flagUrl: "/flags/qa.png" }, { key: "ke", iso2: "KE", titleEn: "Kenya", titlePreciseEn: "Kenya", titleRu: "\u041A\u0435\u043D\u0438\u044F", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041A\u0435\u043D\u0438\u044F", flagUrl: "/flags/ke.png" }, { key: "cy", iso2: "CY", titleEn: "Cyprus", titlePreciseEn: "Cyprus", titleRu: "\u041A\u0438\u043F\u0440", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041A\u0438\u043F\u0440", flagUrl: "/flags/cy.png" }, { key: "kg", iso2: "KG", titleEn: "Kyrgyzstan", titlePreciseEn: "Kyrgyzstan", titleRu: "\u041A\u0438\u0440\u0433\u0438\u0437\u0438\u044F", titlePreciseRu: "\u041A\u0438\u0440\u0433\u0438\u0437\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/kg.png" }, { key: "ki", iso2: "KI", titleEn: "Kiribati", titlePreciseEn: "Kiribati", titleRu: "\u041A\u0438\u0440\u0438\u0431\u0430\u0442\u0438", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041A\u0438\u0440\u0438\u0431\u0430\u0442\u0438", flagUrl: "/flags/ki.png" }, { key: "cn", iso2: "CN", titleEn: "China", titlePreciseEn: "China", titleRu: "\u041A\u0438\u0442\u0430\u0439", titlePreciseRu: "\u041A\u0438\u0442\u0430\u0439\u0441\u043A\u0430\u044F \u041D\u0430\u0440\u043E\u0434\u043D\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/cn.png" }, { key: "cc", iso2: "CC", titleEn: "Cocos (Keeling) Islands", titlePreciseEn: "Cocos (Keeling) Islands", titleRu: "\u041A\u043E\u043A\u043E\u0441\u043E\u0432\u044B\u0435 (\u041A\u0438\u043B\u0438\u043D\u0433) \u043E\u0441\u0442\u0440\u043E\u0432\u0430", titlePreciseRu: "\u041A\u043E\u043A\u043E\u0441\u043E\u0432\u044B\u0435 (\u041A\u0438\u043B\u0438\u043D\u0433) \u043E\u0441\u0442\u0440\u043E\u0432\u0430", flagUrl: "/flags/cc.png" }, { key: "co", iso2: "CO", titleEn: "Colombia", titlePreciseEn: "Colombia", titleRu: "\u041A\u043E\u043B\u0443\u043C\u0431\u0438\u044F", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041A\u043E\u043B\u0443\u043C\u0431\u0438\u044F", flagUrl: "/flags/co.png" }, { key: "km", iso2: "KM", titleEn: "Comoros", titlePreciseEn: "Comoros", titleRu: "\u041A\u043E\u043C\u043E\u0440\u044B", titlePreciseRu: "\u0421\u043E\u044E\u0437 \u041A\u043E\u043C\u043E\u0440\u044B", flagUrl: "/flags/km.png" }, { key: "cg", iso2: "CG", titleEn: "Republic of the Congo", titlePreciseEn: "Congo", titleRu: "\u041A\u043E\u043D\u0433\u043E", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041A\u043E\u043D\u0433\u043E", flagUrl: "/flags/cg.png" }, { key: "cd", iso2: "CD", titleEn: "Democratic Republic of the Congo", titlePreciseEn: "Congo, Democratic Republic of the", titleRu: "\u041A\u043E\u043D\u0433\u043E, \u0414\u0435\u043C\u043E\u043A\u0440\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", titlePreciseRu: "\u0414\u0435\u043C\u043E\u043A\u0440\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041A\u043E\u043D\u0433\u043E", flagUrl: "/flags/cd.png" }, { key: "kp", iso2: "KP", titleEn: "North Korea", titlePreciseEn: "Korea, Democratic People's republic of", titleRu: "\u041A\u043E\u0440\u0435\u044F, \u041D\u0430\u0440\u043E\u0434\u043D\u043E-\u0414\u0435\u043C\u043E\u043A\u0440\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", titlePreciseRu: "\u041A\u043E\u0440\u0435\u0439\u0441\u043A\u0430\u044F \u041D\u0430\u0440\u043E\u0434\u043D\u043E-\u0414\u0435\u043C\u043E\u043A\u0440\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/kp.png" }, { key: "kr", iso2: "KR", titleEn: "South Korea", titlePreciseEn: "South Korea", titleRu: "\u041A\u043E\u0440\u0435\u044F, \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041A\u043E\u0440\u0435\u044F", flagUrl: "/flags/kr.png" }, { key: "cr", iso2: "CR", titleEn: "Costa Rica", titlePreciseEn: "Costa Rica", titleRu: "\u041A\u043E\u0441\u0442\u0430-\u0420\u0438\u043A\u0430", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041A\u043E\u0441\u0442\u0430-\u0420\u0438\u043A\u0430", flagUrl: "/flags/cr.png" }, { key: "ci", iso2: "CI", titleEn: "C\xF4te d'Ivoire", titlePreciseEn: "Cote d'Ivoire", titleRu: "\u041A\u043E\u0442 \u0434'\u0418\u0432\u0443\u0430\u0440", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041A\u043E\u0442 \u0434'\u0418\u0432\u0443\u0430\u0440", flagUrl: "/flags/ci.png" }, { key: "cu", iso2: "CU", titleEn: "Cuba", titlePreciseEn: "Cuba", titleRu: "\u041A\u0443\u0431\u0430", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041A\u0443\u0431\u0430", flagUrl: "/flags/cu.png" }, { key: "kw", iso2: "KW", titleEn: "Kuwait", titlePreciseEn: "Kuwait", titleRu: "\u041A\u0443\u0432\u0435\u0439\u0442", titlePreciseRu: "\u0413\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u043E \u041A\u0443\u0432\u0435\u0439\u0442", flagUrl: "/flags/kw.png" }, { key: "cw", iso2: "CW", titleEn: "Cura\xE7ao", titlePreciseEn: "Cura\xE7ao", titleRu: "\u041A\u044E\u0440\u0430\u0441\u0430\u043E", titlePreciseRu: "\u041A\u044E\u0440\u0430\u0441\u0430\u043E", flagUrl: "/flags/cw.png" }, { key: "la", iso2: "LA", titleEn: "Laos", titlePreciseEn: "Lao People's Democratic Republic", titleRu: "\u041B\u0430\u043E\u0441", titlePreciseRu: "\u041B\u0430\u043E\u0441\u0441\u043A\u0430\u044F \u041D\u0430\u0440\u043E\u0434\u043D\u043E-\u0414\u0435\u043C\u043E\u043A\u0440\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/la.png" }, { key: "lv", iso2: "LV", titleEn: "Latvia", titlePreciseEn: "Latvia", titleRu: "\u041B\u0430\u0442\u0432\u0438\u044F", titlePreciseRu: "\u041B\u0430\u0442\u0432\u0438\u0439\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/lv.png" }, { key: "ls", iso2: "LS", titleEn: "Lesotho", titlePreciseEn: "Lesotho", titleRu: "\u041B\u0435\u0441\u043E\u0442\u043E", titlePreciseRu: "\u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u0442\u0432\u043E \u041B\u0435\u0441\u043E\u0442\u043E", flagUrl: "/flags/ls.png" }, { key: "lb", iso2: "LB", titleEn: "Lebanon", titlePreciseEn: "Lebanon", titleRu: "\u041B\u0438\u0432\u0430\u043D", titlePreciseRu: "\u041B\u0438\u0432\u0430\u043D\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/lb.png" }, { key: "ly", iso2: "LY", titleEn: "Libya", titlePreciseEn: "Libyan Arab Jamahiriya", titleRu: "\u041B\u0438\u0432\u0438\u0439\u0441\u043A\u0430\u044F \u0410\u0440\u0430\u0431\u0441\u043A\u0430\u044F \u0414\u0436\u0430\u043C\u0430\u0445\u0438\u0440\u0438\u044F", titlePreciseRu: "\u0421\u043E\u0446\u0438\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u041D\u0430\u0440\u043E\u0434\u043D\u0430\u044F \u041B\u0438\u0432\u0438\u0439\u0441\u043A\u0430\u044F \u0410\u0440\u0430\u0431\u0441\u043A\u0430\u044F \u0414\u0436\u0430\u043C\u0430\u0445\u0438\u0440\u0438\u044F", flagUrl: "/flags/ly.png" }, { key: "lr", iso2: "LR", titleEn: "Liberia", titlePreciseEn: "Liberia", titleRu: "\u041B\u0438\u0431\u0435\u0440\u0438\u044F", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041B\u0438\u0431\u0435\u0440\u0438\u044F", flagUrl: "/flags/lr.png" }, { key: "li", iso2: "LI", titleEn: "Liechtenstein", titlePreciseEn: "Liechtenstein", titleRu: "\u041B\u0438\u0445\u0442\u0435\u043D\u0448\u0442\u0435\u0439\u043D", titlePreciseRu: "\u041A\u043D\u044F\u0436\u0435\u0441\u0442\u0432\u043E \u041B\u0438\u0445\u0442\u0435\u043D\u0448\u0442\u0435\u0439\u043D", flagUrl: "/flags/li.png" }, { key: "lt", iso2: "LT", titleEn: "Lithuania", titlePreciseEn: "Lithuania", titleRu: "\u041B\u0438\u0442\u0432\u0430", titlePreciseRu: "\u041B\u0438\u0442\u043E\u0432\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/lt.png" }, { key: "lu", iso2: "LU", titleEn: "Luxembourg", titlePreciseEn: "Luxembourg", titleRu: "\u041B\u044E\u043A\u0441\u0435\u043C\u0431\u0443\u0440\u0433", titlePreciseRu: "\u0412\u0435\u043B\u0438\u043A\u043E\u0435 \u0413\u0435\u0440\u0446\u043E\u0433\u0441\u0442\u0432\u043E \u041B\u044E\u043A\u0441\u0435\u043C\u0431\u0443\u0440\u0433", flagUrl: "/flags/lu.png" }, { key: "mu", iso2: "MU", titleEn: "Mauritius", titlePreciseEn: "Mauritius", titleRu: "\u041C\u0430\u0432\u0440\u0438\u043A\u0438\u0439", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041C\u0430\u0432\u0440\u0438\u043A\u0438\u0439", flagUrl: "/flags/mu.png" }, { key: "mr", iso2: "MR", titleEn: "Mauritania", titlePreciseEn: "Mauritania", titleRu: "\u041C\u0430\u0432\u0440\u0438\u0442\u0430\u043D\u0438\u044F", titlePreciseRu: "\u0418\u0441\u043B\u0430\u043C\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041C\u0430\u0432\u0440\u0438\u0442\u0430\u043D\u0438\u044F", flagUrl: "/flags/mr.png" }, { key: "mg", iso2: "MG", titleEn: "Madagascar", titlePreciseEn: "Madagascar", titleRu: "\u041C\u0430\u0434\u0430\u0433\u0430\u0441\u043A\u0430\u0440", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041C\u0430\u0434\u0430\u0433\u0430\u0441\u043A\u0430\u0440", flagUrl: "/flags/mg.png" }, { key: "yt", iso2: "YT", titleEn: "Mayotte", titlePreciseEn: "Mayotte", titleRu: "\u041C\u0430\u0439\u043E\u0442\u0442\u0430", titlePreciseRu: "\u041C\u0430\u0439\u043E\u0442\u0442\u0430", flagUrl: "/flags/yt.png" }, { key: "mo", iso2: "MO", titleEn: "Macau", titlePreciseEn: "Macao", titleRu: "\u041C\u0430\u043A\u0430\u043E", titlePreciseRu: "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0439 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u0440\u0435\u0433\u0438\u043E\u043D \u041A\u0438\u0442\u0430\u044F \u041C\u0430\u043A\u0430\u043E", flagUrl: "/flags/mo.png" }, { key: "mw", iso2: "MW", titleEn: "Malawi", titlePreciseEn: "Malawi", titleRu: "\u041C\u0430\u043B\u0430\u0432\u0438", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041C\u0430\u043B\u0430\u0432\u0438", flagUrl: "/flags/mw.png" }, { key: "my", iso2: "MY", titleEn: "Malaysia", titlePreciseEn: "Malaysia", titleRu: "\u041C\u0430\u043B\u0430\u0439\u0437\u0438\u044F", titlePreciseRu: "\u041C\u0430\u043B\u0430\u0439\u0437\u0438\u044F", flagUrl: "/flags/my.png" }, { key: "ml", iso2: "ML", titleEn: "Mali", titlePreciseEn: "Mali", titleRu: "\u041C\u0430\u043B\u0438", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041C\u0430\u043B\u0438", flagUrl: "/flags/ml.png" }, { key: "um", iso2: "UM", titleEn: "United States Minor Outlying Islands", titlePreciseEn: "United States Minor Outlying Islands", titleRu: "\u041C\u0430\u043B\u044B\u0435 \u0422\u0438\u0445\u043E\u043E\u043A\u0435\u0430\u043D\u0441\u043A\u0438\u0435 \u043E\u0442\u0434\u0430\u043B\u0435\u043D\u043D\u044B\u0435 \u043E\u0441\u0442\u0440\u043E\u0432\u0430 \u0421\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u043D\u044B\u0445 \u0428\u0442\u0430\u0442\u043E\u0432", titlePreciseRu: "\u041C\u0430\u043B\u044B\u0435 \u0422\u0438\u0445\u043E\u043E\u043A\u0435\u0430\u043D\u0441\u043A\u0438\u0435 \u043E\u0442\u0434\u0430\u043B\u0435\u043D\u043D\u044B\u0435 \u043E\u0441\u0442\u0440\u043E\u0432\u0430 \u0421\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u043D\u044B\u0445 \u0428\u0442\u0430\u0442\u043E\u0432", flagUrl: "/flags/um.png" }, { key: "mv", iso2: "MV", titleEn: "Maldives", titlePreciseEn: "Maldives", titleRu: "\u041C\u0430\u043B\u044C\u0434\u0438\u0432\u044B", titlePreciseRu: "\u041C\u0430\u043B\u044C\u0434\u0438\u0432\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/mv.png" }, { key: "mt", iso2: "MT", titleEn: "Malta", titlePreciseEn: "Malta", titleRu: "\u041C\u0430\u043B\u044C\u0442\u0430", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041C\u0430\u043B\u044C\u0442\u0430", flagUrl: "/flags/mt.png" }, { key: "ma", iso2: "MA", titleEn: "Morocco", titlePreciseEn: "Morocco", titleRu: "\u041C\u0430\u0440\u043E\u043A\u043A\u043E", titlePreciseRu: "\u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u0442\u0432\u043E \u041C\u0430\u0440\u043E\u043A\u043A\u043E", flagUrl: "/flags/ma.png" }, { key: "mq", iso2: "MQ", titleEn: "Martinique", titlePreciseEn: "Martinique", titleRu: "\u041C\u0430\u0440\u0442\u0438\u043D\u0438\u043A\u0430", titlePreciseRu: "\u041C\u0430\u0440\u0442\u0438\u043D\u0438\u043A\u0430", flagUrl: "/flags/mq.png" }, { key: "mh", iso2: "MH", titleEn: "Marshall Islands", titlePreciseEn: "Marshall Islands", titleRu: "\u041C\u0430\u0440\u0448\u0430\u043B\u043B\u043E\u0432\u044B \u043E\u0441\u0442\u0440\u043E\u0432\u0430", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041C\u0430\u0440\u0448\u0430\u043B\u043B\u043E\u0432\u044B \u043E\u0441\u0442\u0440\u043E\u0432\u0430", flagUrl: "/flags/mh.png" }, { key: "mx", iso2: "MX", titleEn: "Mexico", titlePreciseEn: "Mexico", titleRu: "\u041C\u0435\u043A\u0441\u0438\u043A\u0430", titlePreciseRu: "\u041C\u0435\u043A\u0441\u0438\u043A\u0430\u043D\u0441\u043A\u0438\u0435 \u0421\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u043D\u044B\u0435 \u0428\u0442\u0430\u0442\u044B", flagUrl: "/flags/mx.png" }, { key: "fm", iso2: "FM", titleEn: "Federated States of Micronesia", titlePreciseEn: "Micronesia, Federated States of", titleRu: "\u041C\u0438\u043A\u0440\u043E\u043D\u0435\u0437\u0438\u044F, \u0424\u0435\u0434\u0435\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u0435 \u0428\u0442\u0430\u0442\u044B", titlePreciseRu: "\u0424\u0435\u0434\u0435\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u0435 \u0448\u0442\u0430\u0442\u044B \u041C\u0438\u043A\u0440\u043E\u043D\u0435\u0437\u0438\u0438", flagUrl: "/flags/fm.png" }, { key: "mz", iso2: "MZ", titleEn: "Mozambique", titlePreciseEn: "Mozambique", titleRu: "\u041C\u043E\u0437\u0430\u043C\u0431\u0438\u043A", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041C\u043E\u0437\u0430\u043C\u0431\u0438\u043A", flagUrl: "/flags/mz.png" }, { key: "md", iso2: "MD", titleEn: "Moldova", titlePreciseEn: "Moldova", titleRu: "\u041C\u043E\u043B\u0434\u043E\u0432\u0430, \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041C\u043E\u043B\u0434\u043E\u0432\u0430", flagUrl: "/flags/md.png" }, { key: "mc", iso2: "MC", titleEn: "Monaco", titlePreciseEn: "Monaco", titleRu: "\u041C\u043E\u043D\u0430\u043A\u043E", titlePreciseRu: "\u041A\u043D\u044F\u0436\u0435\u0441\u0442\u0432\u043E \u041C\u043E\u043D\u0430\u043A\u043E", flagUrl: "/flags/mc.png" }, { key: "mn", iso2: "MN", titleEn: "Mongolia", titlePreciseEn: "Mongolia", titleRu: "\u041C\u043E\u043D\u0433\u043E\u043B\u0438\u044F", titlePreciseRu: "\u041C\u043E\u043D\u0433\u043E\u043B\u0438\u044F", flagUrl: "/flags/mn.png" }, { key: "ms", iso2: "MS", titleEn: "Montserrat", titlePreciseEn: "Montserrat", titleRu: "\u041C\u043E\u043D\u0442\u0441\u0435\u0440\u0440\u0430\u0442", titlePreciseRu: "\u041C\u043E\u043D\u0442\u0441\u0435\u0440\u0440\u0430\u0442", flagUrl: "/flags/ms.png" }, { key: "mm", iso2: "MM", titleEn: "Myanmar", titlePreciseEn: "Burma", titleRu: "\u041C\u044C\u044F\u043D\u043C\u0430", titlePreciseRu: "\u0421\u043E\u044E\u0437 \u041C\u044C\u044F\u043D\u043C\u0430", flagUrl: "/flags/mm.png" }, { key: "na", iso2: "NA", titleEn: "Namibia", titlePreciseEn: "Namibia", titleRu: "\u041D\u0430\u043C\u0438\u0431\u0438\u044F", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041D\u0430\u043C\u0438\u0431\u0438\u044F", flagUrl: "/flags/na.png" }, { key: "nr", iso2: "NR", titleEn: "Nauru", titlePreciseEn: "Nauru", titleRu: "\u041D\u0430\u0443\u0440\u0443", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041D\u0430\u0443\u0440\u0443", flagUrl: "/flags/nr.png" }, { key: "np", iso2: "NP", titleEn: "Nepal", titlePreciseEn: "Nepal", titleRu: "\u041D\u0435\u043F\u0430\u043B", titlePreciseRu: "\u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u0442\u0432\u043E \u041D\u0435\u043F\u0430\u043B", flagUrl: "/flags/np.png" }, { key: "ne", iso2: "NE", titleEn: "Niger", titlePreciseEn: "Niger", titleRu: "\u041D\u0438\u0433\u0435\u0440", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041D\u0438\u0433\u0435\u0440", flagUrl: "/flags/ne.png" }, { key: "ng", iso2: "NG", titleEn: "Nigeria", titlePreciseEn: "Nigeria", titleRu: "\u041D\u0438\u0433\u0435\u0440\u0438\u044F", titlePreciseRu: "\u0424\u0435\u0434\u0435\u0440\u0430\u0442\u0438\u0432\u043D\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041D\u0438\u0433\u0435\u0440\u0438\u044F", flagUrl: "/flags/ng.png" }, { key: "nl", iso2: "NL", titleEn: "Netherlands", titlePreciseEn: "Netherlands", titleRu: "\u041D\u0438\u0434\u0435\u0440\u043B\u0430\u043D\u0434\u044B", titlePreciseRu: "\u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u0442\u0432\u043E \u041D\u0438\u0434\u0435\u0440\u043B\u0430\u043D\u0434\u043E\u0432", flagUrl: "/flags/nl.png" }, { key: "ni", iso2: "NI", titleEn: "Nicaragua", titlePreciseEn: "Nicaragua", titleRu: "\u041D\u0438\u043A\u0430\u0440\u0430\u0433\u0443\u0430", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041D\u0438\u043A\u0430\u0440\u0430\u0433\u0443\u0430", flagUrl: "/flags/ni.png" }, { key: "nu", iso2: "NU", titleEn: "Niue", titlePreciseEn: "Niue", titleRu: "\u041D\u0438\u0443\u044D", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041D\u0438\u0443\u044D", flagUrl: "/flags/nu.png" }, { key: "nz", iso2: "NZ", titleEn: "New Zealand", titlePreciseEn: "New Zealand", titleRu: "\u041D\u043E\u0432\u0430\u044F \u0417\u0435\u043B\u0430\u043D\u0434\u0438\u044F", titlePreciseRu: "\u041D\u043E\u0432\u0430\u044F \u0417\u0435\u043B\u0430\u043D\u0434\u0438\u044F", flagUrl: "/flags/nz.png" }, { key: "nc", iso2: "NC", titleEn: "New Caledonia", titlePreciseEn: "New Caledonia", titleRu: "\u041D\u043E\u0432\u0430\u044F \u041A\u0430\u043B\u0435\u0434\u043E\u043D\u0438\u044F", titlePreciseRu: "\u041D\u043E\u0432\u0430\u044F \u041A\u0430\u043B\u0435\u0434\u043E\u043D\u0438\u044F", flagUrl: "/flags/nc.png" }, { key: "no", iso2: "NO", titleEn: "Norway", titlePreciseEn: "Norway", titleRu: "\u041D\u043E\u0440\u0432\u0435\u0433\u0438\u044F", titlePreciseRu: "\u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u0442\u0432\u043E \u041D\u043E\u0440\u0432\u0435\u0433\u0438\u044F", flagUrl: "/flags/no.png" }, { key: "ae", iso2: "AE", titleEn: "United Arab Emirates", titlePreciseEn: "United Arab Emirates", titleRu: "\u041E\u0431\u044A\u0435\u0434\u0438\u043D\u0435\u043D\u043D\u044B\u0435 \u0410\u0440\u0430\u0431\u0441\u043A\u0438\u0435 \u042D\u043C\u0438\u0440\u0430\u0442\u044B", titlePreciseRu: "\u041E\u0431\u044A\u0435\u0434\u0438\u043D\u0435\u043D\u043D\u044B\u0435 \u0410\u0440\u0430\u0431\u0441\u043A\u0438\u0435 \u042D\u043C\u0438\u0440\u0430\u0442\u044B", flagUrl: "/flags/ae.png" }, { key: "om", iso2: "OM", titleEn: "Oman", titlePreciseEn: "Oman", titleRu: "\u041E\u043C\u0430\u043D", titlePreciseRu: "\u0421\u0443\u043B\u0442\u0430\u043D\u0430\u0442 \u041E\u043C\u0430\u043D", flagUrl: "/flags/om.png" }, { key: "bv", iso2: "BV", titleEn: "Bouvet Island", titlePreciseEn: "Bouvet Island", titleRu: "\u041E\u0441\u0442\u0440\u043E\u0432 \u0411\u0443\u0432\u0435", titlePreciseRu: "\u041E\u0441\u0442\u0440\u043E\u0432 \u0411\u0443\u0432\u0435", flagUrl: "/flags/bv.png" }, { key: "im", iso2: "IM", titleEn: "Isle of Man", titlePreciseEn: "Isle of Man", titleRu: "\u041E\u0441\u0442\u0440\u043E\u0432 \u041C\u044D\u043D", titlePreciseRu: "\u041E\u0441\u0442\u0440\u043E\u0432 \u041C\u044D\u043D", flagUrl: "/flags/im.png" }, { key: "nf", iso2: "NF", titleEn: "Norfolk Island", titlePreciseEn: "Norfolk Island", titleRu: "\u041E\u0441\u0442\u0440\u043E\u0432 \u041D\u043E\u0440\u0444\u043E\u043B\u043A", titlePreciseRu: "\u041E\u0441\u0442\u0440\u043E\u0432 \u041D\u043E\u0440\u0444\u043E\u043B\u043A", flagUrl: "/flags/nf.png" }, { key: "cx", iso2: "CX", titleEn: "Christmas Island", titlePreciseEn: "Christmas Island", titleRu: "\u041E\u0441\u0442\u0440\u043E\u0432 \u0420\u043E\u0436\u0434\u0435\u0441\u0442\u0432\u0430", titlePreciseRu: "\u041E\u0441\u0442\u0440\u043E\u0432 \u0420\u043E\u0436\u0434\u0435\u0441\u0442\u0432\u0430", flagUrl: "/flags/cx.png" }, { key: "hm", iso2: "HM", titleEn: "Heard Island and McDonald Islands", titlePreciseEn: "Heard Island and McDonald Islands", titleRu: "\u041E\u0441\u0442\u0440\u043E\u0432 \u0425\u0435\u0440\u0434 \u0438 \u043E\u0441\u0442\u0440\u043E\u0432\u0430 \u041C\u0430\u043A\u0434\u043E\u043D\u0430\u043B\u044C\u0434", titlePreciseRu: "\u041E\u0441\u0442\u0440\u043E\u0432 \u0425\u0435\u0440\u0434 \u0438 \u043E\u0441\u0442\u0440\u043E\u0432\u0430 \u041C\u0430\u043A\u0434\u043E\u043D\u0430\u043B\u044C\u0434", flagUrl: "/flags/hm.png" }, { key: "ky", iso2: "KY", titleEn: "Cayman Islands", titlePreciseEn: "Cayman Islands", titleRu: "\u041E\u0441\u0442\u0440\u043E\u0432\u0430 \u041A\u0430\u0439\u043C\u0430\u043D", titlePreciseRu: "\u041E\u0441\u0442\u0440\u043E\u0432\u0430 \u041A\u0430\u0439\u043C\u0430\u043D", flagUrl: "/flags/ky.png" }, { key: "ck", iso2: "CK", titleEn: "Cook Islands", titlePreciseEn: "Cook Islands", titleRu: "\u041E\u0441\u0442\u0440\u043E\u0432\u0430 \u041A\u0443\u043A\u0430", titlePreciseRu: "\u041E\u0441\u0442\u0440\u043E\u0432\u0430 \u041A\u0443\u043A\u0430", flagUrl: "/flags/ck.png" }, { key: "tc", iso2: "TC", titleEn: "Turks and Caicos Islands", titlePreciseEn: "Turks and Caicos Islands", titleRu: "\u041E\u0441\u0442\u0440\u043E\u0432\u0430 \u0422\u0435\u0440\u043A\u0441 \u0438 \u041A\u0430\u0439\u043A\u043E\u0441", titlePreciseRu: "\u041E\u0441\u0442\u0440\u043E\u0432\u0430 \u0422\u0435\u0440\u043A\u0441 \u0438 \u041A\u0430\u0439\u043A\u043E\u0441", flagUrl: "/flags/tc.png" }, { key: "pk", iso2: "PK", titleEn: "Pakistan", titlePreciseEn: "Pakistan", titleRu: "\u041F\u0430\u043A\u0438\u0441\u0442\u0430\u043D", titlePreciseRu: "\u0418\u0441\u043B\u0430\u043C\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041F\u0430\u043A\u0438\u0441\u0442\u0430\u043D", flagUrl: "/flags/pk.png" }, { key: "pw", iso2: "PW", titleEn: "Palau", titlePreciseEn: "Palau", titleRu: "\u041F\u0430\u043B\u0430\u0443", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041F\u0430\u043B\u0430\u0443", flagUrl: "/flags/pw.png" }, { key: "ps", iso2: "PS", titleEn: "State of Palestine", titlePreciseEn: "Palestinian Territory, Occupied", titleRu: "\u041F\u0430\u043B\u0435\u0441\u0442\u0438\u043D\u0441\u043A\u0430\u044F \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u044F, \u043E\u043A\u043A\u0443\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u0430\u044F", titlePreciseRu: "\u041E\u043A\u043A\u0443\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u0430\u044F \u041F\u0430\u043B\u0435\u0441\u0442\u0438\u043D\u0441\u043A\u0430\u044F \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u044F", flagUrl: "/flags/ps.png" }, { key: "pa", iso2: "PA", titleEn: "Panama", titlePreciseEn: "Panama", titleRu: "\u041F\u0430\u043D\u0430\u043C\u0430", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041F\u0430\u043D\u0430\u043C\u0430", flagUrl: "/flags/pa.png" }, { key: "va", iso2: "VA", titleEn: "Holy See", titlePreciseEn: "Holy See (Vatican City State)", titleRu: "\u041F\u0430\u043F\u0441\u043A\u0438\u0439 \u041F\u0440\u0435\u0441\u0442\u043E\u043B (\u0413\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u043E &mdash; \u0433\u043E\u0440\u043E\u0434 \u0412\u0430\u0442\u0438\u043A\u0430\u043D)", titlePreciseRu: "\u041F\u0430\u043F\u0441\u043A\u0438\u0439 \u041F\u0440\u0435\u0441\u0442\u043E\u043B (\u0413\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u043E &mdash; \u0433\u043E\u0440\u043E\u0434 \u0412\u0430\u0442\u0438\u043A\u0430\u043D)", flagUrl: "/flags/va.png" }, { key: "pg", iso2: "PG", titleEn: "Papua New Guinea", titlePreciseEn: "Papua New Guinea", titleRu: "\u041F\u0430\u043F\u0443\u0430-\u041D\u043E\u0432\u0430\u044F \u0413\u0432\u0438\u043D\u0435\u044F", titlePreciseRu: "\u041F\u0430\u043F\u0443\u0430-\u041D\u043E\u0432\u0430\u044F \u0413\u0432\u0438\u043D\u0435\u044F", flagUrl: "/flags/pg.png" }, { key: "py", iso2: "PY", titleEn: "Paraguay", titlePreciseEn: "Paraguay", titleRu: "\u041F\u0430\u0440\u0430\u0433\u0432\u0430\u0439", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041F\u0430\u0440\u0430\u0433\u0432\u0430\u0439", flagUrl: "/flags/py.png" }, { key: "pe", iso2: "PE", titleEn: "Peru", titlePreciseEn: "Peru", titleRu: "\u041F\u0435\u0440\u0443", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041F\u0435\u0440\u0443", flagUrl: "/flags/pe.png" }, { key: "pn", iso2: "PN", titleEn: "Pitcairn", titlePreciseEn: "Pitcairn", titleRu: "\u041F\u0438\u0442\u043A\u0435\u0440\u043D", titlePreciseRu: "\u041F\u0438\u0442\u043A\u0435\u0440\u043D", flagUrl: "/flags/pn.png" }, { key: "pl", iso2: "PL", titleEn: "Poland", titlePreciseEn: "Poland", titleRu: "\u041F\u043E\u043B\u044C\u0448\u0430", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041F\u043E\u043B\u044C\u0448\u0430", flagUrl: "/flags/pl.png" }, { key: "pt", iso2: "PT", titleEn: "Portugal", titlePreciseEn: "Portugal", titleRu: "\u041F\u043E\u0440\u0442\u0443\u0433\u0430\u043B\u0438\u044F", titlePreciseRu: "\u041F\u043E\u0440\u0442\u0443\u0433\u0430\u043B\u044C\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/pt.png" }, { key: "pr", iso2: "PR", titleEn: "Puerto Rico", titlePreciseEn: "Puerto Rico", titleRu: "\u041F\u0443\u044D\u0440\u0442\u043E-\u0420\u0438\u043A\u043E", titlePreciseRu: "\u041F\u0443\u044D\u0440\u0442\u043E-\u0420\u0438\u043A\u043E", flagUrl: "/flags/pr.png" }, { key: "mk", iso2: "MK", titleEn: "North Macedonia", titlePreciseEn: "Macedonia, The Former Yugoslav Republic Of", titleRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041C\u0430\u043A\u0435\u0434\u043E\u043D\u0438\u044F", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041C\u0430\u043A\u0435\u0434\u043E\u043D\u0438\u044F", flagUrl: "/flags/mk.png" }, { key: "re", iso2: "RE", titleEn: "R\xE9union", titlePreciseEn: "Reunion", titleRu: "\u0420\u0435\u044E\u043D\u044C\u043E\u043D", titlePreciseRu: "\u0420\u0435\u044E\u043D\u044C\u043E\u043D", flagUrl: "/flags/re.png" }, { key: "ru", iso2: "RU", titleEn: "Russia", titlePreciseEn: "Russia", titleRu: "\u0420\u043E\u0441\u0441\u0438\u044F", titlePreciseRu: "\u0420\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u0430\u044F \u0424\u0435\u0434\u0435\u0440\u0430\u0446\u0438\u044F", flagUrl: "/flags/ru.png" }, { key: "rw", iso2: "RW", titleEn: "Rwanda", titlePreciseEn: "Rwanda", titleRu: "\u0420\u0443\u0430\u043D\u0434\u0430", titlePreciseRu: "\u0420\u0443\u0430\u043D\u0434\u0438\u0439\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/rw.png" }, { key: "ro", iso2: "RO", titleEn: "Romania", titlePreciseEn: "Romania", titleRu: "\u0420\u0443\u043C\u044B\u043D\u0438\u044F", titlePreciseRu: "\u0420\u0443\u043C\u044B\u043D\u0438\u044F", flagUrl: "/flags/ro.png" }, { key: "ws", iso2: "WS", titleEn: "Samoa", titlePreciseEn: "Samoa", titleRu: "\u0421\u0430\u043C\u043E\u0430", titlePreciseRu: "\u041D\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0435 \u0413\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u043E \u0421\u0430\u043C\u043E\u0430", flagUrl: "/flags/ws.png" }, { key: "sm", iso2: "SM", titleEn: "San Marino", titlePreciseEn: "San Marino", titleRu: "\u0421\u0430\u043D-\u041C\u0430\u0440\u0438\u043D\u043E", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0421\u0430\u043D-\u041C\u0430\u0440\u0438\u043D\u043E", flagUrl: "/flags/sm.png" }, { key: "st", iso2: "ST", titleEn: "Sao Tome and Principe", titlePreciseEn: "Sao Tome and Principe", titleRu: "\u0421\u0430\u043D-\u0422\u043E\u043C\u0435 \u0438 \u041F\u0440\u0438\u043D\u0441\u0438\u043F\u0438", titlePreciseRu: "\u0414\u0435\u043C\u043E\u043A\u0440\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0421\u0430\u043D-\u0422\u043E\u043C\u0435 \u0438 \u041F\u0440\u0438\u043D\u0441\u0438\u043F\u0438", flagUrl: "/flags/st.png" }, { key: "sa", iso2: "SA", titleEn: "Saudi Arabia", titlePreciseEn: "Saudi Arabia", titleRu: "\u0421\u0430\u0443\u0434\u043E\u0432\u0441\u043A\u0430\u044F \u0410\u0440\u0430\u0432\u0438\u044F", titlePreciseRu: "\u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u0442\u0432\u043E \u0421\u0430\u0443\u0434\u043E\u0432\u0441\u043A\u0430\u044F \u0410\u0440\u0430\u0432\u0438\u044F", flagUrl: "/flags/sa.png" }, { key: "sz", iso2: "SZ", titleEn: "Eswatini", titlePreciseEn: "Swaziland", titleRu: "\u0421\u0432\u0430\u0437\u0438\u043B\u0435\u043D\u0434", titlePreciseRu: "\u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u0442\u0432\u043E \u0421\u0432\u0430\u0437\u0438\u043B\u0435\u043D\u0434", flagUrl: "/flags/sz.png" }, { key: "sh", iso2: "SH", titleEn: "Saint Helena, Ascension and Tristan da Cunha", titlePreciseEn: "Saint Helena, Ascension And Tristan Da Cunha", titleRu: "\u0421\u0432\u044F\u0442\u0430\u044F \u0415\u043B\u0435\u043D\u0430, \u041E\u0441\u0442\u0440\u043E\u0432 \u0432\u043E\u0437\u043D\u0435\u0441\u0435\u043D\u0438\u044F, \u0422\u0440\u0438\u0441\u0442\u0430\u043D-\u0434\u0430-\u041A\u0443\u043D\u044C\u044F", titlePreciseRu: "\u0421\u0432\u044F\u0442\u0430\u044F \u0415\u043B\u0435\u043D\u0430, \u041E\u0441\u0442\u0440\u043E\u0432 \u0432\u043E\u0437\u043D\u0435\u0441\u0435\u043D\u0438\u044F, \u0422\u0440\u0438\u0441\u0442\u0430\u043D-\u0434\u0430-\u041A\u0443\u043D\u044C\u044F", flagUrl: "/flags/sh.png" }, { key: "mp", iso2: "MP", titleEn: "Northern Mariana Islands", titlePreciseEn: "Northern Mariana Islands", titleRu: "\u0421\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u041C\u0430\u0440\u0438\u0430\u043D\u0441\u043A\u0438\u0435 \u043E\u0441\u0442\u0440\u043E\u0432\u0430", titlePreciseRu: "\u0421\u043E\u0434\u0440\u0443\u0436\u0435\u0441\u0442\u0432\u043E \u0421\u0435\u0432\u0435\u0440\u043D\u044B\u0445 \u041C\u0430\u0440\u0438\u0430\u043D\u0441\u043A\u0438\u0445 \u043E\u0441\u0442\u0440\u043E\u0432\u043E\u0432", flagUrl: "/flags/mp.png" }, { key: "bl", iso2: "BL", titleEn: "Saint Barth\xE9lemy", titlePreciseEn: "Saint Barth\xE9lemy", titleRu: "\u0421\u0435\u043D-\u0411\u0430\u0440\u0442\u0435\u043B\u044C\u043C\u0438", titlePreciseRu: "\u0421\u0435\u043D-\u0411\u0430\u0440\u0442\u0435\u043B\u044C\u043C\u0438", flagUrl: "/flags/bl.png" }, { key: "mf", iso2: "MF", titleEn: "Saint Martin", titlePreciseEn: "Saint Martin (French Part)", titleRu: "\u0421\u0435\u043D-\u041C\u0430\u0440\u0442\u0435\u043D", titlePreciseRu: "\u0421\u0435\u043D-\u041C\u0430\u0440\u0442\u0435\u043D", flagUrl: "/flags/mf.png" }, { key: "sn", iso2: "SN", titleEn: "Senegal", titlePreciseEn: "Senegal", titleRu: "\u0421\u0435\u043D\u0435\u0433\u0430\u043B", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0421\u0435\u043D\u0435\u0433\u0430\u043B", flagUrl: "/flags/sn.png" }, { key: "vc", iso2: "VC", titleEn: "Saint Vincent and the Grenadines", titlePreciseEn: "Saint Vincent and the Grenadines", titleRu: "\u0421\u0435\u043D\u0442-\u0412\u0438\u043D\u0441\u0435\u043D\u0442 \u0438 \u0413\u0440\u0435\u043D\u0430\u0434\u0438\u043D\u044B", titlePreciseRu: "\u0421\u0435\u043D\u0442-\u0412\u0438\u043D\u0441\u0435\u043D\u0442 \u0438 \u0413\u0440\u0435\u043D\u0430\u0434\u0438\u043D\u044B", flagUrl: "/flags/vc.png" }, { key: "kn", iso2: "KN", titleEn: "Saint Kitts and Nevis", titlePreciseEn: "Saint Kitts and Nevis", titleRu: "\u0421\u0435\u043D\u0442-\u041A\u0438\u0442\u0441 \u0438 \u041D\u0435\u0432\u0438\u0441", titlePreciseRu: "\u0421\u0435\u043D\u0442-\u041A\u0438\u0442\u0441 \u0438 \u041D\u0435\u0432\u0438\u0441", flagUrl: "/flags/kn.png" }, { key: "lc", iso2: "LC", titleEn: "Saint Lucia", titlePreciseEn: "Saint Lucia", titleRu: "\u0421\u0435\u043D\u0442-\u041B\u044E\u0441\u0438\u044F", titlePreciseRu: "\u0421\u0435\u043D\u0442-\u041B\u044E\u0441\u0438\u044F", flagUrl: "/flags/lc.png" }, { key: "pm", iso2: "PM", titleEn: "Saint Pierre and Miquelon", titlePreciseEn: "Saint Pierre and Miquelon", titleRu: "\u0421\u0435\u043D\u0442-\u041F\u044C\u0435\u0440 \u0438\xA0\u041C\u0438\u043A\u0435\u043B\u043E\u043D", titlePreciseRu: "\u0421\u0435\u043D\u0442-\u041F\u044C\u0435\u0440 \u0438\xA0\u041C\u0438\u043A\u0435\u043B\u043E\u043D", flagUrl: "/flags/pm.png" }, { key: "rs", iso2: "RS", titleEn: "Serbia", titlePreciseEn: "Serbia", titleRu: "\u0421\u0435\u0440\u0431\u0438\u044F", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0421\u0435\u0440\u0431\u0438\u044F", flagUrl: "/flags/rs.png" }, { key: "sc", iso2: "SC", titleEn: "Seychelles", titlePreciseEn: "Seychelles", titleRu: "\u0421\u0435\u0439\u0448\u0435\u043B\u044B", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0421\u0435\u0439\u0448\u0435\u043B\u044B", flagUrl: "/flags/sc.png" }, { key: "sg", iso2: "SG", titleEn: "Singapore", titlePreciseEn: "Singapore", titleRu: "\u0421\u0438\u043D\u0433\u0430\u043F\u0443\u0440", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0421\u0438\u043D\u0433\u0430\u043F\u0443\u0440", flagUrl: "/flags/sg.png" }, { key: "sx", iso2: "SX", titleEn: "Sint Maarten", titlePreciseEn: "Sint Maarten", titleRu: "\u0421\u0438\u043D\u0442-\u041C\u0430\u0440\u0442\u0435\u043D", titlePreciseRu: "\u0421\u0438\u043D\u0442-\u041C\u0430\u0440\u0442\u0435\u043D", flagUrl: "/flags/sx.png" }, { key: "sy", iso2: "SY", titleEn: "Syria", titlePreciseEn: "Syrian Arab Republic", titleRu: "\u0421\u0438\u0440\u0438\u0439\u0441\u043A\u0430\u044F \u0410\u0440\u0430\u0431\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", titlePreciseRu: "\u0421\u0438\u0440\u0438\u0439\u0441\u043A\u0430\u044F \u0410\u0440\u0430\u0431\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/sy.png" }, { key: "sk", iso2: "SK", titleEn: "Slovakia", titlePreciseEn: "Slovakia", titleRu: "\u0421\u043B\u043E\u0432\u0430\u043A\u0438\u044F", titlePreciseRu: "\u0421\u043B\u043E\u0432\u0430\u0446\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/sk.png" }, { key: "si", iso2: "SI", titleEn: "Slovenia", titlePreciseEn: "Slovenia", titleRu: "\u0421\u043B\u043E\u0432\u0435\u043D\u0438\u044F", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0421\u043B\u043E\u0432\u0435\u043D\u0438\u044F", flagUrl: "/flags/si.png" }, { key: "gb", iso2: "GB", titleEn: "United Kingdom", titlePreciseEn: "United Kingdom", titleRu: "\u0421\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u043D\u043E\u0435 \u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u0442\u0432\u043E", titlePreciseRu: "\u0421\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u043D\u043E\u0435 \u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u0442\u0432\u043E \u0412\u0435\u043B\u0438\u043A\u043E\u0431\u0440\u0438\u0442\u0430\u043D\u0438\u0438 \u0438 \u0421\u0435\u0432\u0435\u0440\u043D\u043E\u0439 \u0418\u0440\u043B\u0430\u043D\u0434\u0438\u0438", flagUrl: "/flags/gb.png" }, { key: "us", iso2: "US", titleEn: "USA", titlePreciseEn: "United States", titleRu: "\u0421\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u043D\u044B\u0435 \u0428\u0442\u0430\u0442\u044B", titlePreciseRu: "\u0421\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u043D\u044B\u0435 \u0428\u0442\u0430\u0442\u044B \u0410\u043C\u0435\u0440\u0438\u043A\u0438", flagUrl: "/flags/us.png" }, { key: "sb", iso2: "SB", titleEn: "Solomon Islands", titlePreciseEn: "Solomon Islands", titleRu: "\u0421\u043E\u043B\u043E\u043C\u043E\u043D\u043E\u0432\u044B \u043E\u0441\u0442\u0440\u043E\u0432\u0430", titlePreciseRu: "\u0421\u043E\u043B\u043E\u043C\u043E\u043D\u043E\u0432\u044B \u043E\u0441\u0442\u0440\u043E\u0432\u0430", flagUrl: "/flags/sb.png" }, { key: "so", iso2: "SO", titleEn: "Somalia", titlePreciseEn: "Somalia", titleRu: "\u0421\u043E\u043C\u0430\u043B\u0438", titlePreciseRu: "\u0421\u043E\u043C\u0430\u043B\u0438\u0439\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/so.png" }, { key: "sd", iso2: "SD", titleEn: "Sudan", titlePreciseEn: "Sudan", titleRu: "\u0421\u0443\u0434\u0430\u043D", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0421\u0443\u0434\u0430\u043D", flagUrl: "/flags/sd.png" }, { key: "sr", iso2: "SR", titleEn: "Suriname", titlePreciseEn: "Suriname", titleRu: "\u0421\u0443\u0440\u0438\u043D\u0430\u043C", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0421\u0443\u0440\u0438\u043D\u0430\u043C", flagUrl: "/flags/sr.png" }, { key: "sl", iso2: "SL", titleEn: "Sierra Leone", titlePreciseEn: "Sierra Leone", titleRu: "\u0421\u044C\u0435\u0440\u0440\u0430-\u041B\u0435\u043E\u043D\u0435", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0421\u044C\u0435\u0440\u0440\u0430-\u041B\u0435\u043E\u043D\u0435", flagUrl: "/flags/sl.png" }, { key: "tj", iso2: "TJ", titleEn: "Tajikistan", titlePreciseEn: "Tajikistan", titleRu: "\u0422\u0430\u0434\u0436\u0438\u043A\u0438\u0441\u0442\u0430\u043D", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0422\u0430\u0434\u0436\u0438\u043A\u0438\u0441\u0442\u0430\u043D", flagUrl: "/flags/tj.png" }, { key: "th", iso2: "TH", titleEn: "Thailand", titlePreciseEn: "Thailand", titleRu: "\u0422\u0430\u0438\u043B\u0430\u043D\u0434", titlePreciseRu: "\u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u0442\u0432\u043E \u0422\u0430\u0438\u043B\u0430\u043D\u0434", flagUrl: "/flags/th.png" }, { key: "tw", iso2: "TW", titleEn: "Taiwan", titlePreciseEn: "Taiwan, Province of China", titleRu: "\u0422\u0430\u0439\u0432\u0430\u043D\u044C (\u041A\u0438\u0442\u0430\u0439)", titlePreciseRu: "\u0422\u0430\u0439\u0432\u0430\u043D\u044C (\u041A\u0438\u0442\u0430\u0439)", flagUrl: "/flags/tw.png" }, { key: "tz", iso2: "TZ", titleEn: "Tanzania", titlePreciseEn: "Tanzania, United Republic Of", titleRu: "\u0422\u0430\u043D\u0437\u0430\u043D\u0438\u044F, \u041E\u0431\u044A\u0435\u0434\u0438\u043D\u0435\u043D\u043D\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", titlePreciseRu: "\u041E\u0431\u044A\u0435\u0434\u0438\u043D\u0435\u043D\u043D\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0422\u0430\u043D\u0437\u0430\u043D\u0438\u044F", flagUrl: "/flags/tz.png" }, { key: "tl", iso2: "TL", titleEn: "Timor-Leste", titlePreciseEn: "Timor-Leste", titleRu: "\u0422\u0438\u043C\u043E\u0440-\u041B\u0435\u0441\u0442\u0435", titlePreciseRu: "\u0414\u0435\u043C\u043E\u043A\u0440\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0422\u0438\u043C\u043E\u0440-\u041B\u0435\u0441\u0442\u0435", flagUrl: "/flags/tl.png" }, { key: "tg", iso2: "TG", titleEn: "Togo", titlePreciseEn: "Togo", titleRu: "\u0422\u043E\u0433\u043E", titlePreciseRu: "\u0422\u043E\u0433\u043E\u043B\u0435\u0437\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/tg.png" }, { key: "tk", iso2: "TK", titleEn: "Tokelau", titlePreciseEn: "Tokelau", titleRu: "\u0422\u043E\u043A\u0435\u043B\u0430\u0443", titlePreciseRu: "\u0422\u043E\u043A\u0435\u043B\u0430\u0443", flagUrl: "/flags/tk.png" }, { key: "to", iso2: "TO", titleEn: "Tonga", titlePreciseEn: "Tonga", titleRu: "\u0422\u043E\u043D\u0433\u0430", titlePreciseRu: "\u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u0442\u0432\u043E \u0422\u043E\u043D\u0433\u0430", flagUrl: "/flags/to.png" }, { key: "tt", iso2: "TT", titleEn: "Trinidad and Tobago", titlePreciseEn: "Trinidad and Tobago", titleRu: "\u0422\u0440\u0438\u043D\u0438\u0434\u0430\u0434 \u0438 \u0422\u043E\u0431\u0430\u0433\u043E", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0422\u0440\u0438\u043D\u0438\u0434\u0430\u0434 \u0438 \u0422\u043E\u0431\u0430\u0433\u043E", flagUrl: "/flags/tt.png" }, { key: "tv", iso2: "TV", titleEn: "Tuvalu", titlePreciseEn: "Tuvalu", titleRu: "\u0422\u0443\u0432\u0430\u043B\u0443", titlePreciseRu: "\u0422\u0443\u0432\u0430\u043B\u0443", flagUrl: "/flags/tv.png" }, { key: "tn", iso2: "TN", titleEn: "Tunisia", titlePreciseEn: "Tunisia", titleRu: "\u0422\u0443\u043D\u0438\u0441", titlePreciseRu: "\u0422\u0443\u043D\u0438\u0441\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/tn.png" }, { key: "tm", iso2: "TM", titleEn: "Turkmenistan", titlePreciseEn: "Turkmenistan", titleRu: "\u0422\u0443\u0440\u043A\u043C\u0435\u043D\u0438\u044F", titlePreciseRu: "\u0422\u0443\u0440\u043A\u043C\u0435\u043D\u0438\u0441\u0442\u0430\u043D", flagUrl: "/flags/tm.png" }, { key: "tr", iso2: "TR", titleEn: "Turkey", titlePreciseEn: "Turkey", titleRu: "\u0422\u0443\u0440\u0446\u0438\u044F", titlePreciseRu: "\u0422\u0443\u0440\u0435\u0446\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/tr.png" }, { key: "ug", iso2: "UG", titleEn: "Uganda", titlePreciseEn: "Uganda", titleRu: "\u0423\u0433\u0430\u043D\u0434\u0430", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0423\u0433\u0430\u043D\u0434\u0430", flagUrl: "/flags/ug.png" }, { key: "uz", iso2: "UZ", titleEn: "Uzbekistan", titlePreciseEn: "Uzbekistan", titleRu: "\u0423\u0437\u0431\u0435\u043A\u0438\u0441\u0442\u0430\u043D", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0423\u0437\u0431\u0435\u043A\u0438\u0441\u0442\u0430\u043D", flagUrl: "/flags/uz.png" }, { key: "ua", iso2: "UA", titleEn: "Ukraine", titlePreciseEn: "Ukraine", titleRu: "\u0423\u043A\u0440\u0430\u0438\u043D\u0430", titlePreciseRu: "\u0423\u043A\u0440\u0430\u0438\u043D\u0430", flagUrl: "/flags/ua.png" }, { key: "wf", iso2: "WF", titleEn: "Wallis and Futuna", titlePreciseEn: "Wallis and Futuna", titleRu: "\u0423\u043E\u043B\u043B\u0438\u0441 \u0438 \u0424\u0443\u0442\u0443\u043D\u0430", titlePreciseRu: "\u0423\u043E\u043B\u043B\u0438\u0441 \u0438 \u0424\u0443\u0442\u0443\u043D\u0430", flagUrl: "/flags/wf.png" }, { key: "uy", iso2: "UY", titleEn: "Uruguay", titlePreciseEn: "Uruguay", titleRu: "\u0423\u0440\u0443\u0433\u0432\u0430\u0439", titlePreciseRu: "\u0412\u043E\u0441\u0442\u043E\u0447\u043D\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0423\u0440\u0443\u0433\u0432\u0430\u0439", flagUrl: "/flags/uy.png" }, { key: "fo", iso2: "FO", titleEn: "Faroe Islands", titlePreciseEn: "Faroe Islands", titleRu: "\u0424\u0430\u0440\u0435\u0440\u0441\u043A\u0438\u0435 \u043E\u0441\u0442\u0440\u043E\u0432\u0430", titlePreciseRu: "\u0424\u0430\u0440\u0435\u0440\u0441\u043A\u0438\u0435 \u043E\u0441\u0442\u0440\u043E\u0432\u0430", flagUrl: "/flags/fo.png" }, { key: "fj", iso2: "FJ", titleEn: "Fiji", titlePreciseEn: "Fiji", titleRu: "\u0424\u0438\u0434\u0436\u0438", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u043E\u0441\u0442\u0440\u043E\u0432\u043E\u0432 \u0424\u0438\u0434\u0436\u0438", flagUrl: "/flags/fj.png" }, { key: "ph", iso2: "PH", titleEn: "Philippines", titlePreciseEn: "Philippines", titleRu: "\u0424\u0438\u043B\u0438\u043F\u043F\u0438\u043D\u044B", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0424\u0438\u043B\u0438\u043F\u043F\u0438\u043D\u044B", flagUrl: "/flags/ph.png" }, { key: "fi", iso2: "FI", titleEn: "Finland", titlePreciseEn: "Finland", titleRu: "\u0424\u0438\u043D\u043B\u044F\u043D\u0434\u0438\u044F", titlePreciseRu: "\u0424\u0438\u043D\u043B\u044F\u043D\u0434\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/fi.png" }, { key: "fk", iso2: "FK", titleEn: "Falkland Islands", titlePreciseEn: "Falkland Islands (Malvinas)", titleRu: "\u0424\u043E\u043B\u043A\u043B\u0435\u043D\u0434\u0441\u043A\u0438\u0435 \u043E\u0441\u0442\u0440\u043E\u0432\u0430 (\u041C\u0430\u043B\u044C\u0432\u0438\u043D\u0441\u043A\u0438\u0435)", titlePreciseRu: "\u0424\u043E\u043B\u043A\u043B\u0435\u043D\u0434\u0441\u043A\u0438\u0435 \u043E\u0441\u0442\u0440\u043E\u0432\u0430 (\u041C\u0430\u043B\u044C\u0432\u0438\u043D\u0441\u043A\u0438\u0435)", flagUrl: "/flags/fk.png" }, { key: "fr", iso2: "FR", titleEn: "France", titlePreciseEn: "France", titleRu: "\u0424\u0440\u0430\u043D\u0446\u0438\u044F", titlePreciseRu: "\u0424\u0440\u0430\u043D\u0446\u0443\u0437\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/fr.png" }, { key: "gf", iso2: "GF", titleEn: "French Guiana", titlePreciseEn: "French Guiana", titleRu: "\u0424\u0440\u0430\u043D\u0446\u0443\u0437\u0441\u043A\u0430\u044F \u0413\u0432\u0438\u0430\u043D\u0430", titlePreciseRu: "\u0424\u0440\u0430\u043D\u0446\u0443\u0437\u0441\u043A\u0430\u044F \u0413\u0432\u0438\u0430\u043D\u0430", flagUrl: "/flags/gf.png" }, { key: "pf", iso2: "PF", titleEn: "French Polynesia", titlePreciseEn: "French Polynesia", titleRu: "\u0424\u0440\u0430\u043D\u0446\u0443\u0437\u0441\u043A\u0430\u044F \u041F\u043E\u043B\u0438\u043D\u0435\u0437\u0438\u044F", titlePreciseRu: "\u0424\u0440\u0430\u043D\u0446\u0443\u0437\u0441\u043A\u0430\u044F \u041F\u043E\u043B\u0438\u043D\u0435\u0437\u0438\u044F", flagUrl: "/flags/pf.png" }, { key: "tf", iso2: "TF", titleEn: "French Southern Territories", titlePreciseEn: "French Southern Territories", titleRu: "\u0424\u0440\u0430\u043D\u0446\u0443\u0437\u0441\u043A\u0438\u0435 \u042E\u0436\u043D\u044B\u0435 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0438", titlePreciseRu: "\u0424\u0440\u0430\u043D\u0446\u0443\u0437\u0441\u043A\u0438\u0435 \u042E\u0436\u043D\u044B\u0435 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0438", flagUrl: "/flags/tf.png" }, { key: "hr", iso2: "HR", titleEn: "Croatia", titlePreciseEn: "Croatia", titleRu: "\u0425\u043E\u0440\u0432\u0430\u0442\u0438\u044F", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0425\u043E\u0440\u0432\u0430\u0442\u0438\u044F", flagUrl: "/flags/hr.png" }, { key: "cf", iso2: "CF", titleEn: "Central African Republic", titlePreciseEn: "Central African Republic", titleRu: "\u0426\u0435\u043D\u0442\u0440\u0430\u043B\u044C\u043D\u043E-\u0410\u0444\u0440\u0438\u043A\u0430\u043D\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", titlePreciseRu: "\u0426\u0435\u043D\u0442\u0440\u0430\u043B\u044C\u043D\u043E-\u0410\u0444\u0440\u0438\u043A\u0430\u043D\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/cf.png" }, { key: "td", iso2: "TD", titleEn: "Chad", titlePreciseEn: "Chad", titleRu: "\u0427\u0430\u0434", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0427\u0430\u0434", flagUrl: "/flags/td.png" }, { key: "me", iso2: "ME", titleEn: "Montenegro", titlePreciseEn: "Montenegro", titleRu: "\u0427\u0435\u0440\u043D\u043E\u0433\u043E\u0440\u0438\u044F", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0427\u0435\u0440\u043D\u043E\u0433\u043E\u0440\u0438\u044F", flagUrl: "/flags/me.png" }, { key: "cz", iso2: "CZ", titleEn: "Czech Republic", titlePreciseEn: "Czech Republic", titleRu: "\u0427\u0435\u0448\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", titlePreciseRu: "\u0427\u0435\u0448\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/cz.png" }, { key: "cl", iso2: "CL", titleEn: "Chile", titlePreciseEn: "Chile", titleRu: "\u0427\u0438\u043B\u0438", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0427\u0438\u043B\u0438", flagUrl: "/flags/cl.png" }, { key: "ch", iso2: "CH", titleEn: "Switzerland", titlePreciseEn: "Switzerland", titleRu: "\u0428\u0432\u0435\u0439\u0446\u0430\u0440\u0438\u044F", titlePreciseRu: "\u0428\u0432\u0435\u0439\u0446\u0430\u0440\u0441\u043A\u0430\u044F \u041A\u043E\u043D\u0444\u0435\u0434\u0435\u0440\u0430\u0446\u0438\u044F", flagUrl: "/flags/ch.png" }, { key: "se", iso2: "SE", titleEn: "Sweden", titlePreciseEn: "Sweden", titleRu: "\u0428\u0432\u0435\u0446\u0438\u044F", titlePreciseRu: "\u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u0442\u0432\u043E \u0428\u0432\u0435\u0446\u0438\u044F", flagUrl: "/flags/se.png" }, { key: "sj", iso2: "SJ", titleEn: "Svalbard and Jan Mayen", titlePreciseEn: "Svalbard and Jan Mayen", titleRu: "\u0428\u043F\u0438\u0446\u0431\u0435\u0440\u0433\u0435\u043D \u0438 \u042F\u043D \u041C\u0430\u0439\u0435\u043D", titlePreciseRu: "\u0428\u043F\u0438\u0446\u0431\u0435\u0440\u0433\u0435\u043D \u0438 \u042F\u043D \u041C\u0430\u0439\u0435\u043D", flagUrl: "/flags/sj.png" }, { key: "lk", iso2: "LK", titleEn: "Sri Lanka", titlePreciseEn: "Sri Lanka", titleRu: "\u0428\u0440\u0438-\u041B\u0430\u043D\u043A\u0430", titlePreciseRu: "\u0414\u0435\u043C\u043E\u043A\u0440\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0421\u043E\u0446\u0438\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0428\u0440\u0438-\u041B\u0430\u043D\u043A\u0430", flagUrl: "/flags/lk.png" }, { key: "ec", iso2: "EC", titleEn: "Ecuador", titlePreciseEn: "Ecuador", titleRu: "\u042D\u043A\u0432\u0430\u0434\u043E\u0440", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u042D\u043A\u0432\u0430\u0434\u043E\u0440", flagUrl: "/flags/ec.png" }, { key: "gq", iso2: "GQ", titleEn: "Equatorial Guinea", titlePreciseEn: "Equatorial Guinea", titleRu: "\u042D\u043A\u0432\u0430\u0442\u043E\u0440\u0438\u0430\u043B\u044C\u043D\u0430\u044F \u0413\u0432\u0438\u043D\u0435\u044F", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u042D\u043A\u0432\u0430\u0442\u043E\u0440\u0438\u0430\u043B\u044C\u043D\u0430\u044F \u0413\u0432\u0438\u043D\u0435\u044F", flagUrl: "/flags/gq.png" }, { key: "ax", iso2: "AX", titleEn: "Aland Islands", titlePreciseEn: "\xC5land Islands", titleRu: "\u042D\u043B\u0430\u043D\u0434\u0441\u043A\u0438\u0435 \u043E\u0441\u0442\u0440\u043E\u0432\u0430", titlePreciseRu: "\u042D\u043B\u0430\u043D\u0434\u0441\u043A\u0438\u0435 \u043E\u0441\u0442\u0440\u043E\u0432\u0430", flagUrl: "/flags/ax.png" }, { key: "sv", iso2: "SV", titleEn: "El Salvador", titlePreciseEn: "El Salvador", titleRu: "\u042D\u043B\u044C-\u0421\u0430\u043B\u044C\u0432\u0430\u0434\u043E\u0440", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u042D\u043B\u044C-\u0421\u0430\u043B\u044C\u0432\u0430\u0434\u043E\u0440", flagUrl: "/flags/sv.png" }, { key: "er", iso2: "ER", titleEn: "Eritrea", titlePreciseEn: "Eritrea", titleRu: "\u042D\u0440\u0438\u0442\u0440\u0435\u044F", titlePreciseRu: "\u042D\u0440\u0438\u0442\u0440\u0435\u044F", flagUrl: "/flags/er.png" }, { key: "ee", iso2: "EE", titleEn: "Estonia", titlePreciseEn: "Estonia", titleRu: "\u042D\u0441\u0442\u043E\u043D\u0438\u044F", titlePreciseRu: "\u042D\u0441\u0442\u043E\u043D\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/ee.png" }, { key: "et", iso2: "ET", titleEn: "Ethiopia", titlePreciseEn: "Ethiopia", titleRu: "\u042D\u0444\u0438\u043E\u043F\u0438\u044F", titlePreciseRu: "\u0424\u0435\u0434\u0435\u0440\u0430\u0442\u0438\u0432\u043D\u0430\u044F \u0414\u0435\u043C\u043E\u043A\u0440\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u042D\u0444\u0438\u043E\u043F\u0438\u044F", flagUrl: "/flags/et.png" }, { key: "za", iso2: "ZA", titleEn: "South Africa", titlePreciseEn: "South Africa", titleRu: "\u042E\u0436\u043D\u0430\u044F \u0410\u0444\u0440\u0438\u043A\u0430", titlePreciseRu: "\u042E\u0436\u043D\u043E-\u0410\u0444\u0440\u0438\u043A\u0430\u043D\u0441\u043A\u0430\u044F \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430", flagUrl: "/flags/za.png" }, { key: "gs", iso2: "GS", titleEn: "South Georgia and the South Sandwich Islands", titlePreciseEn: "South Georgia and the South Sandwich Islands", titleRu: "\u042E\u0436\u043D\u0430\u044F \u0414\u0436\u043E\u0440\u0434\u0436\u0438\u044F \u0438 \u042E\u0436\u043D\u044B\u0435 \u0421\u0430\u043D\u0434\u0432\u0438\u0447\u0435\u0432\u044B \u043E\u0441\u0442\u0440\u043E\u0432\u0430", titlePreciseRu: "\u042E\u0436\u043D\u0430\u044F \u0414\u0436\u043E\u0440\u0434\u0436\u0438\u044F \u0438 \u042E\u0436\u043D\u044B\u0435 \u0421\u0430\u043D\u0434\u0432\u0438\u0447\u0435\u0432\u044B \u043E\u0441\u0442\u0440\u043E\u0432\u0430", flagUrl: "/flags/gs.png" }, { key: "os", iso2: "OS", titleEn: "South Ossetia", titlePreciseEn: "South Ossetia", titleRu: "\u042E\u0436\u043D\u0430\u044F \u041E\u0441\u0435\u0442\u0438\u044F", titlePreciseRu: "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u042E\u0436\u043D\u0430\u044F \u041E\u0441\u0435\u0442\u0438\u044F", flagUrl: "/flags/os.png" }, { key: "ss", iso2: "SS", titleEn: "South Sudan", titlePreciseEn: "South Sudan", titleRu: "\u042E\u0436\u043D\u044B\u0439 \u0421\u0443\u0434\u0430\u043D", titlePreciseRu: "\u042E\u0436\u043D\u044B\u0439 \u0421\u0443\u0434\u0430\u043D", flagUrl: "/flags/ss.png" }, { key: "jm", iso2: "JM", titleEn: "Jamaica", titlePreciseEn: "Jamaica", titleRu: "\u042F\u043C\u0430\u0439\u043A\u0430", titlePreciseRu: "\u042F\u043C\u0430\u0439\u043A\u0430", flagUrl: "/flags/jm.png" }, { key: "jp", iso2: "JP", titleEn: "Japan", titlePreciseEn: "Japan", titleRu: "\u042F\u043F\u043E\u043D\u0438\u044F", titlePreciseRu: "\u042F\u043F\u043E\u043D\u0438\u044F", flagUrl: "/flags/jp.png" }, { key: "ac", iso2: "AC", titleEn: "Ascension Island", titlePreciseEn: "Ascension Island", titleRu: "AC", titlePreciseRu: "AC", flagUrl: "/flags/ac.png" }, { key: "cefta", iso2: "CEFTA", titleEn: "Central European Free Trade Agreement", titlePreciseEn: "Central European Free Trade Agreement", titleRu: "CEFTA", titlePreciseRu: "CEFTA", flagUrl: "/flags/cefta.png" }, { key: "cp", iso2: "CP", titleEn: "Clipperton Island", titlePreciseEn: "Clipperton Island", titleRu: "CP", titlePreciseRu: "CP", flagUrl: "/flags/cp.png" }, { key: "dg", iso2: "DG", titleEn: "Diego Garcia", titlePreciseEn: "Diego Garcia", titleRu: "DG", titlePreciseRu: "DG", flagUrl: "/flags/dg.png" }, { key: "ea", iso2: "EA", titleEn: "Ceuta & Melilla", titlePreciseEn: "Ceuta & Melilla", titleRu: "EA", titlePreciseRu: "EA", flagUrl: "/flags/ea.png" }, { key: "es-ct", iso2: "ES-CT", titleEn: "Catalonia", titlePreciseEn: "Catalonia", titleRu: "ES-CT", titlePreciseRu: "ES-CT", flagUrl: "/flags/es-ct.png" }, { key: "es-ga", iso2: "ES-GA", titleEn: "Galicia", titlePreciseEn: "Galicia", titleRu: "ES-GA", titlePreciseRu: "ES-GA", flagUrl: "/flags/es-ga.png" }, { key: "eu", iso2: "EU", titleEn: "Europe", titlePreciseEn: "Europe", titleRu: "EU", titlePreciseRu: "EU", flagUrl: "/flags/eu.png" }, { key: "gb-eng", iso2: "GB-ENG", titleEn: "England", titlePreciseEn: "England", titleRu: "GB-ENG", titlePreciseRu: "GB-ENG", flagUrl: "/flags/gb-eng.png" }, { key: "gb-nir", iso2: "GB-NIR", titleEn: "Northern Ireland", titlePreciseEn: "Northern Ireland", titleRu: "GB-NIR", titlePreciseRu: "GB-NIR", flagUrl: "/flags/gb-nir.png" }, { key: "gb-sct", iso2: "GB-SCT", titleEn: "Scotland", titlePreciseEn: "Scotland", titleRu: "GB-SCT", titlePreciseRu: "GB-SCT", flagUrl: "/flags/gb-sct.png" }, { key: "gb-wls", iso2: "GB-WLS", titleEn: "Wales", titlePreciseEn: "Wales", titleRu: "GB-WLS", titlePreciseRu: "GB-WLS", flagUrl: "/flags/gb-wls.png" }, { key: "ic", iso2: "IC", titleEn: "Canary Islands", titlePreciseEn: "Canary Islands", titleRu: "IC", titlePreciseRu: "IC", flagUrl: "/flags/ic.png" }, { key: "ta", iso2: "TA", titleEn: "Tristan da Cunha", titlePreciseEn: "Tristan da Cunha", titleRu: "TA", titlePreciseRu: "TA", flagUrl: "/flags/ta.png" }, { key: "un", iso2: "UN", titleEn: "United Nations", titlePreciseEn: "United Nations", titleRu: "UN", titlePreciseRu: "UN", flagUrl: "/flags/un.png" }, { key: "xk", iso2: "XK", titleEn: "Kosovo", titlePreciseEn: "Kosovo", titleRu: "XK", titlePreciseRu: "XK", flagUrl: "/flags/xk.png" }, { key: "total", iso2: "TOTAL", titleEn: "Total", titlePreciseEn: "Total", titleRu: "\u0418\u0442\u043E\u0433\u043E", titlePreciseRu: "\u0418\u0442\u043E\u0433\u043E", isTotal: true, isComposite: true, flagUrl: "/flags/total.png" }, { key: "other", iso2: "OTHER", titleEn: "Other", titlePreciseEn: "Other", titleRu: "\u0414\u0440\u0443\u0433\u0438\u0435", titlePreciseRu: "\u0414\u0440\u0443\u0433\u0438\u0435", isOther: true, isComposite: true, flagUrl: "/flags/other.png" }, { key: "unknown", iso2: "UNKNOWN", titleEn: "Unknown", titlePreciseEn: "Unknown", titleRu: "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E", titlePreciseRu: "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E", isUnknown: true, isComposite: true, flagUrl: "/flags/unknown.png" }];

// src/countries/countries.ts
var lcTitleToCountry = {};
var keyToCountry = {};
for (const countryModel of countries_min_default) {
  lcTitleToCountry[countryModel.titleEn.toLowerCase()] = countryModel;
  lcTitleToCountry[countryModel.titlePreciseEn.toLowerCase()] = countryModel;
  keyToCountry[countryModel.key] = countryModel;
}
function getCountryKeyByTitleOwner(item) {
  const lcTitle = item.country.toLowerCase();
  return lcTitleToCountry[lcTitle]?.key ?? lcTitle;
}
function getCountryByKey(countryKey) {
  return keyToCountry[countryKey] ?? createCountryModelByKey(countryKey);
}
function createCountryModelByKey(key) {
  const title = key.toUpperCase();
  return {
    key,
    iso2: title,
    titleEn: title,
    titlePreciseEn: title,
    titleRu: title,
    titlePreciseRu: title,
    isUnknown: true,
    flagUrl: `/flags/unknown.png`
  };
}

// src/formats.ts
var SIMPLE_CSV_SEPARATOR = `,`;
function parseSimpleCsv(csv, map = IDENTITY) {
  return String(csv ?? ``).split(SIMPLE_CSV_SEPARATOR).map(map).filter(Boolean);
}
function stringifySimpleCsv(values) {
  return values.join(SIMPLE_CSV_SEPARATOR);
}
function parseJSON(jsonString, defaultValue = void 0) {
  if (!jsonString) {
    return defaultValue;
  }
  try {
    return JSON.parse(jsonString);
  } catch {
    return defaultValue;
  }
}
function pipeJSON(value) {
  return JSON.parse(JSON.stringify(value));
}
var isWorse = (pos, otherPos) => pos > otherPos;
var notWorse = (pos, otherPos) => pos <= otherPos;
var isBetter = (pos, otherPos) => pos < otherPos;
var notBetter = (pos, otherPos) => pos >= otherPos;

// src/keyboard.ts
var KeyboardKey = {
  ESCAPE: `Escape`,
  SHIFT: `Shift`,
  ALT: `Alt`,
  CTRL: `Control`,
  ARROW_LEFT: `ArrowLeft`,
  ARROW_RIGHT: `ArrowRight`,
  NUM0: `0`,
  NUM1: `1`,
  NUM2: `2`,
  NUM3: `3`,
  NUM4: `4`,
  NUM5: `5`,
  NUM6: `6`,
  NUM7: `7`,
  NUM8: `8`,
  NUM9: `9`,
  PLUS: `+`,
  MINUS: `-`,
  E: `e`
};
var KeyboardCode = {
  ESCAPE: 27,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  NUM0: 48,
  NUM1: 49,
  NUM2: 50,
  NUM3: 51,
  NUM4: 52,
  NUM5: 53,
  NUM6: 54,
  NUM7: 55,
  NUM8: 56,
  NUM9: 57,
  META: 91,
  C: 67
};

// src/maps.ts
function booleanMapToArray(index, value = true) {
  return Object.keys(index).filter((key) => index[key] === value);
}
function arrayToBooleanMap(array, value = true) {
  return Object.fromEntries(array.map((it) => [it, value]));
}
function toggleBooleanMap(index, key) {
  if (index[key]) {
    delete index[key];
    return index;
  }
  index[key] = true;
  return index;
}
function takeMapItem(index, key) {
  const result = index[key];
  delete index[key];
  return result;
}
function toggleArrayValue(values, value) {
  const index = values.indexOf(value);
  if (index !== -1) {
    values.splice(index, 1);
    return false;
  }
  values.push(value);
  return true;
}
function isActiveArrayValue(values, value, activeIfEmpty = false) {
  return values.length === 0 ? activeIfEmpty : values.includes(value);
}
function arrayToOrderMap(array) {
  return Object.fromEntries(array.map((it, order) => [it, order + 1]));
}
function sequenceToValuesWithCount(sequence) {
  let value = UNSET;
  let count = 0;
  const valuesWithCount = [];
  for (const sequenceValue of sequence) {
    if (sequenceValue === value) {
      count++;
      continue;
    }
    if (count > 0) {
      valuesWithCount.push({ value, count });
    }
    value = sequenceValue;
    count = 1;
  }
  if (count > 0) {
    valuesWithCount.push({ value, count });
  }
  return valuesWithCount;
}
function getValuesWithCountLog(valuesWithCount) {
  return valuesWithCount.map(({ value, count }) => `${JSON.stringify(value)}x${count}`);
}
function setIndexMapValue(index, keys, value) {
  let localIndex = index;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (i === keys.length - 1) {
      localIndex.set(key, value);
      return true;
    }
    if (!localIndex.has(key)) {
      localIndex.set(key, /* @__PURE__ */ new Map());
    }
    localIndex = localIndex.get(key);
  }
  return false;
}
function getIndexMapValue(index, keys, defaultValue = void 0) {
  let localIndex = index;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (typeof localIndex !== `object` || !localIndex.has(key)) {
      return defaultValue;
    }
    localIndex = localIndex.get(key);
  }
  return localIndex;
}
function removeIndexMapValue(index, keys, value = UNSET) {
  const indices = [index];
  let currentIndex = index;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!currentIndex.has(key)) {
      return false;
    }
    if (i < keys.length - 1) {
      currentIndex = currentIndex.get(key);
      indices.push(currentIndex);
      continue;
    }
    if (value !== UNSET && currentIndex.get(key) !== value) {
      return false;
    }
    currentIndex.delete(key);
    for (let j = indices.length - 1; j > 0; j--) {
      if (indices[j].size === 0) {
        indices[j - 1].delete(keys[j - 1]);
      }
    }
    return true;
  }
  return false;
}

// src/numbers.ts
var TEN_REMAINDER_TO_NOMINATIVE_MALE = {
  0: "\u044B\u0439" /* FIRST */,
  1: "\u044B\u0439" /* FIRST */,
  2: "\u043E\u0439" /* SECOND */,
  3: "\u0438\u0439" /* THIRD */,
  4: "\u044B\u0439" /* FIRST */,
  5: "\u044B\u0439" /* FIRST */,
  6: "\u043E\u0439" /* SECOND */,
  7: "\u043E\u0439" /* SECOND */,
  8: "\u043E\u0439" /* SECOND */,
  9: "\u044B\u0439" /* FIRST */
};
var TEN_REMAINDER_TO_GENITIVE_FEMALE = {
  0: "\u043E\u0439" /* SECOND */,
  1: "\u043E\u0439" /* SECOND */,
  2: "\u043E\u0439" /* SECOND */,
  3: "\u0435\u0439" /* THIRD */,
  4: "\u043E\u0439" /* SECOND */,
  5: "\u043E\u0439" /* SECOND */,
  6: "\u043E\u0439" /* SECOND */,
  7: "\u043E\u0439" /* SECOND */,
  8: "\u043E\u0439" /* SECOND */,
  9: "\u043E\u0439" /* SECOND */
};
var TEN_REMAINDER_TO_ACCUSATIVE_FEMALE = {
  0: 2 /* THIRD */,
  1: 0 /* FIRST */,
  2: 1 /* SECOND */,
  3: 1 /* SECOND */,
  4: 1 /* SECOND */,
  5: 2 /* THIRD */,
  6: 2 /* THIRD */,
  7: 2 /* THIRD */,
  8: 2 /* THIRD */,
  9: 2 /* THIRD */
};
function getNominativeMaleOrder(value) {
  value = Math.abs(value);
  const hundredRemainder = value % 100;
  if (10 <= hundredRemainder && hundredRemainder <= 19) {
    return "\u044B\u0439" /* FIRST */;
  }
  if (value === 0) {
    return "\u043E\u0439" /* SECOND */;
  }
  const tenRemainder = value % 10;
  return TEN_REMAINDER_TO_NOMINATIVE_MALE[tenRemainder];
}
function getGenitiveFemaleOrder(value) {
  value = Math.abs(value);
  const hundredRemainder = value % 100;
  if (10 <= hundredRemainder && hundredRemainder <= 19) {
    return "\u043E\u0439" /* SECOND */;
  }
  const tenRemainder = value % 10;
  return TEN_REMAINDER_TO_GENITIVE_FEMALE[tenRemainder];
}
function getAccusativeFemaleOrder(value, orderValues) {
  value = Math.abs(value);
  const hundredRemainder = value % 100;
  if (10 <= hundredRemainder && hundredRemainder <= 19) {
    return orderValues[2 /* THIRD */];
  }
  const tenRemainder = value % 10;
  return orderValues[TEN_REMAINDER_TO_ACCUSATIVE_FEMALE[tenRemainder]];
}
function formatSize(size, sizeFactor = 1024) {
  if (!Number.isFinite(size)) {
    return `-`;
  }
  if (size < sizeFactor) {
    return `${formatNumber(size)} \u0431\u0430\u0439\u0442`;
  }
  size /= sizeFactor;
  if (size < sizeFactor) {
    return `${formatNumber(size)} \u041A\u0431\u0430\u0439\u0442`;
  }
  size /= sizeFactor;
  if (size < sizeFactor) {
    return `${formatNumber(size)} \u041C\u0431\u0430\u0439\u0442`;
  }
  size /= sizeFactor;
  return `${formatNumber(size)} \u0413\u0431\u0430\u0439\u0442`;
}
function formatNumber(number, fractionDigits = 0, decimalPoint = `.`, thousandSeparator = `&nbsp;`, defaultValue = `-`) {
  if (!Number.isFinite(number)) {
    return defaultValue;
  }
  return number.toFixed(fractionDigits).replace(/[.,]/g, decimalPoint).replace(/\B(?=(?:\d{3})+(?!\d))/g, thousandSeparator);
}
function roundNumber(number, factor, onRound = Math.round) {
  return onRound(number / factor) * factor;
}
function roundDecimalNumber(number, precision, onRound = Math.round) {
  if (!Number.isFinite(number)) {
    return void 0;
  }
  const factor = 10 ** precision;
  return onRound(number * factor) / factor;
}
function getPercentage(thisValue, prevValue) {
  if (!thisValue || !prevValue) {
    return void 0;
  }
  const fraction = (thisValue - prevValue) / (prevValue ?? 1);
  return Math.round(fraction * MAX_PERCENTAGE);
}
function getPercentageDecimals(percentage) {
  return percentage < 4 ? 1 : 0;
}
function formatPercentage(percentage) {
  return formatNumber(percentage, getPercentageDecimals(percentage));
}
function calcAsc(a, b, getValue = IDENTITY) {
  return getValue(a) - getValue(b);
}
function calcDesc(a, b, getValue = IDENTITY) {
  return getValue(b) - getValue(a);
}
function compareAsc(getValue = IDENTITY) {
  return (a, b) => calcAsc(a, b, getValue);
}
function compareDesc(getValue = IDENTITY) {
  return (a, b) => calcDesc(a, b, getValue);
}

// src/op.ts
var OpStates = {
  DEFAULT: { name: `default`, isDefault: true },
  PENDING: { name: `pending`, isPending: true },
  OK: { name: `ok`, isOk: true, isResolved: true },
  ERROR: { name: `error`, isError: true, isResolved: true }
};
var findOpStateByName = (name, defaultOp = OpStates.DEFAULT) => {
  return Object.values(OpStates).find((op) => op.name === name) ?? defaultOp;
};
var runOp = async (state, callback) => {
  try {
    state.value = OpStates.PENDING;
    const text = await callback();
    state.value = OpStates.OK;
    return text;
  } catch (err) {
    state.value = OpStates.ERROR;
  }
};

// src/order-by.ts
var ASC = 1;
var DESC = -1;
var doOrderBy = (iterable, dir, selector) => {
  return Array.from(iterable).sort((a, b) => {
    a = selector(a);
    b = selector(b);
    if (a < b) {
      return -dir;
    }
    if (a > b) {
      return dir;
    }
    return 0;
  });
};
var orderBy = (iterable, selector = IDENTITY) => doOrderBy(iterable, ASC, selector);
var orderByDescending = (iterable, selector = IDENTITY) => doOrderBy(iterable, DESC, selector);
export {
  ARRAY,
  ASC,
  DATE_LENGTH,
  DATE_TIME_LENGTH,
  DAY,
  DAYS_IN_MONTH,
  DAYS_IN_WEEK,
  DAYS_IN_YEAR,
  DESC,
  FOREVER,
  FRIDAY,
  GB,
  GET_ARRAY,
  GET_OBJECT,
  HAS_ITEMS,
  HOUR,
  HOURS_IN_DAY,
  IDENTITIES,
  IDENTITY,
  JSON_ARRAY,
  JSON_OBJECT,
  KB,
  KeyboardCode,
  KeyboardKey,
  MAX_PERCENTAGE,
  MB,
  MINUTE,
  MINUTES_IN_HOUR,
  MONDAY,
  MONTH,
  NO,
  NOOP,
  OBJECT,
  OpStates,
  PB,
  SATURDAY,
  SECOND,
  SECONDS_IN_MINUTE,
  SET_FILTER,
  SORT_NUMBER,
  SUNDAY,
  TB,
  THURSDAY,
  TIMEZONE,
  TIME_LENGTH,
  TOGGLE,
  TO_NUMBER,
  TUESDAY,
  UNIQUE,
  UNSET,
  WEDNESDAY,
  WEEK,
  WEEKS_IN_YEAR,
  YES,
  arrayToBooleanMap,
  arrayToOrderMap,
  at,
  booleanMapToArray,
  bound,
  boundClassTS,
  boundTS,
  cacheWithMap,
  cacheWithObject,
  cached,
  cachedTS,
  calcAsc,
  calcDesc,
  compareAsc,
  compareDesc,
  compareTime,
  convertTimeToSeconds,
  findOpStateByName,
  flushDefers,
  formatDate,
  formatDateForHumans,
  formatDateTime,
  formatDateTimeForHumans,
  formatDayForHumans,
  formatNumber,
  formatPercentage,
  formatSize,
  formatTime,
  formatTimeSpan,
  getAccusativeFemaleOrder,
  getCountryByKey,
  getCountryKeyByTitleOwner,
  getDateFromDateTime,
  getGenitiveFemaleOrder,
  getIfNotEpoch,
  getIndexMapValue,
  getNominativeMaleOrder,
  getPercentage,
  getPercentageDecimals,
  getValuesWithCountLog,
  guessDateModel,
  humanizeDuration,
  incrementYear,
  isActiveArrayValue,
  isBetter,
  isValidAt,
  isValidDate,
  isValidMs,
  isWorse,
  keyToCountry,
  lcTitleToCountry,
  loopCallback,
  ms,
  notBetter,
  notWorse,
  now,
  orderBy,
  orderByDescending,
  parseJSON,
  parseSimpleCsv,
  pipeJSON,
  promises,
  removeIndexMapValue,
  roundDate,
  roundDecimalNumber,
  roundNumber,
  runOp,
  sequenceToValuesWithCount,
  setIndexMapValue,
  sleep,
  stringifySimpleCsv,
  synchronized,
  synchronizedTS,
  takeMapItem,
  toggleArrayValue,
  toggleBooleanMap,
  withCustomYear,
  withPreviousYear
};
