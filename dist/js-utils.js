var jsUtils = (function (exports) {
  'use strict';

  const UNDEFINED = Object.freeze({});
  const OBJECT = Object.freeze({});
  const JSON_OBJECT = JSON.stringify(OBJECT);
  const ARRAY = Object.freeze([]);
  const JSON_ARRAY = JSON.stringify(ARRAY);
  const FOREVER = true;
  const MAX_PERCENTAGE = 100;

  const NOOP = (_) => void 0;
  const YES = () => true;
  const NO = () => false;
  const GET_ARRAY = () => ARRAY;
  const GET_OBJECT = () => OBJECT;
  const IDENTITY = (v) => v;
  const IDENTITIES = (...v) => v;
  const NOT = (v) => !v;
  const HAS_ITEMS = (v) => Array.isArray(v) && v.length !== 0;
  const SET_FILTER = (item, index, array) => array.indexOf(item) === index;
  const SORT_NUMBER = (number, otherNumber) => number - otherNumber;
  const TO_NUMBER = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : void 0;
  };
  const UNIQUE = (array) => Array.from(new Set(array));

  const KB = 1024;
  const MB = 1024 * KB;
  const GB = 1024 * MB;
  const TB = 1024 * GB;
  const PB = 1024 * TB;

  const DATE_LENGTH = 10;
  const TIME_LENGTH = 8;
  const DATE_TIME_LENGTH = DATE_LENGTH + 1 + TIME_LENGTH;
  const SECOND = 1e3;
  const SECONDS_IN_MINUTE = 60;
  const MINUTE = SECOND * SECONDS_IN_MINUTE;
  const MINUTES_IN_HOUR = 60;
  const HOUR = MINUTE * MINUTES_IN_HOUR;
  const HOURS_IN_DAY = 24;
  const DAY = HOURS_IN_DAY * HOUR;
  const DAYS_IN_WEEK = 7;
  const WEEK = DAYS_IN_WEEK * DAY;
  const DAYS_IN_MONTH = 28;
  const MONTH = DAYS_IN_MONTH * DAY;
  const WEEKS_IN_YEAR = 52;
  const DAYS_IN_YEAR = WEEKS_IN_YEAR * DAYS_IN_WEEK;
  const SUNDAY = 0;
  const MONDAY = 1;
  const TUESDAY = 2;
  const WEDNESDAY = 3;
  const THURSDAY = 4;
  const FRIDAY = 5;
  const SATURDAY = 6;

  const KeyboardKey = {
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
  const KeyboardCode = {
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

  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  const OpStates = {
    DEFAULT: { name: `default`, isDefault: true },
    PENDING: { name: `pending`, isPending: true },
    OK: { name: `ok`, isOk: true, isResolved: true },
    ERROR: { name: `error`, isError: true, isResolved: true }
  };
  const findOpStateByName = (name, defaultOp = OpStates.DEFAULT) => {
    var _a;
    return (_a = Object.values(OpStates).find((op) => op.name === name)) != null ? _a : defaultOp;
  };
  const runOp = (state, callback) => __async(void 0, null, function* () {
    try {
      state.value = OpStates.PENDING;
      const text = yield callback();
      state.value = OpStates.OK;
      return text;
    } catch (err) {
      state.value = OpStates.ERROR;
    }
  });

  const ASC = 1;
  const DESC = -1;
  const doOrderBy = (iterable, dir, selector) => {
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
  const orderBy = (iterable, selector = IDENTITY) => doOrderBy(iterable, ASC, selector);
  const orderByDescending = (iterable, selector = IDENTITY) => doOrderBy(iterable, DESC, selector);

  exports.ARRAY = ARRAY;
  exports.ASC = ASC;
  exports.DATE_LENGTH = DATE_LENGTH;
  exports.DATE_TIME_LENGTH = DATE_TIME_LENGTH;
  exports.DAY = DAY;
  exports.DAYS_IN_MONTH = DAYS_IN_MONTH;
  exports.DAYS_IN_WEEK = DAYS_IN_WEEK;
  exports.DAYS_IN_YEAR = DAYS_IN_YEAR;
  exports.DESC = DESC;
  exports.FOREVER = FOREVER;
  exports.FRIDAY = FRIDAY;
  exports.GB = GB;
  exports.GET_ARRAY = GET_ARRAY;
  exports.GET_OBJECT = GET_OBJECT;
  exports.HAS_ITEMS = HAS_ITEMS;
  exports.HOUR = HOUR;
  exports.HOURS_IN_DAY = HOURS_IN_DAY;
  exports.IDENTITIES = IDENTITIES;
  exports.IDENTITY = IDENTITY;
  exports.JSON_ARRAY = JSON_ARRAY;
  exports.JSON_OBJECT = JSON_OBJECT;
  exports.KB = KB;
  exports.KeyboardCode = KeyboardCode;
  exports.KeyboardKey = KeyboardKey;
  exports.MAX_PERCENTAGE = MAX_PERCENTAGE;
  exports.MB = MB;
  exports.MINUTE = MINUTE;
  exports.MINUTES_IN_HOUR = MINUTES_IN_HOUR;
  exports.MONDAY = MONDAY;
  exports.MONTH = MONTH;
  exports.NO = NO;
  exports.NOOP = NOOP;
  exports.NOT = NOT;
  exports.OBJECT = OBJECT;
  exports.OpStates = OpStates;
  exports.PB = PB;
  exports.SATURDAY = SATURDAY;
  exports.SECOND = SECOND;
  exports.SECONDS_IN_MINUTE = SECONDS_IN_MINUTE;
  exports.SET_FILTER = SET_FILTER;
  exports.SORT_NUMBER = SORT_NUMBER;
  exports.SUNDAY = SUNDAY;
  exports.TB = TB;
  exports.THURSDAY = THURSDAY;
  exports.TIME_LENGTH = TIME_LENGTH;
  exports.TO_NUMBER = TO_NUMBER;
  exports.TUESDAY = TUESDAY;
  exports.UNDEFINED = UNDEFINED;
  exports.UNIQUE = UNIQUE;
  exports.WEDNESDAY = WEDNESDAY;
  exports.WEEK = WEEK;
  exports.WEEKS_IN_YEAR = WEEKS_IN_YEAR;
  exports.YES = YES;
  exports.findOpStateByName = findOpStateByName;
  exports.orderBy = orderBy;
  exports.orderByDescending = orderByDescending;
  exports.runOp = runOp;

  return exports;

})({});
