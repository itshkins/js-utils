"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  ARRAY: () => ARRAY,
  ASC: () => ASC,
  DATE_LENGTH: () => DATE_LENGTH,
  DATE_TIME_LENGTH: () => DATE_TIME_LENGTH,
  DAY: () => DAY,
  DAYS_IN_MONTH: () => DAYS_IN_MONTH,
  DAYS_IN_WEEK: () => DAYS_IN_WEEK,
  DAYS_IN_YEAR: () => DAYS_IN_YEAR,
  DESC: () => DESC,
  FOREVER: () => FOREVER,
  FRIDAY: () => FRIDAY,
  GB: () => GB,
  GET_ARRAY: () => GET_ARRAY,
  GET_OBJECT: () => GET_OBJECT,
  HAS_ITEMS: () => HAS_ITEMS,
  HOUR: () => HOUR,
  HOURS_IN_DAY: () => HOURS_IN_DAY,
  IDENTITIES: () => IDENTITIES,
  IDENTITY: () => IDENTITY,
  JSON_ARRAY: () => JSON_ARRAY,
  JSON_OBJECT: () => JSON_OBJECT,
  KB: () => KB,
  KeyboardCode: () => KeyboardCode,
  KeyboardKey: () => KeyboardKey,
  MAX_PERCENTAGE: () => MAX_PERCENTAGE,
  MB: () => MB,
  MINUTE: () => MINUTE,
  MINUTES_IN_HOUR: () => MINUTES_IN_HOUR,
  MONDAY: () => MONDAY,
  MONTH: () => MONTH,
  NO: () => NO,
  NOOP: () => NOOP,
  NOT: () => NOT,
  OBJECT: () => OBJECT,
  OpState: () => OpState,
  SATURDAY: () => SATURDAY,
  SECOND: () => SECOND,
  SECONDS_IN_MINUTE: () => SECONDS_IN_MINUTE,
  SET_FILTER: () => SET_FILTER,
  SORT_NUMBER: () => SORT_NUMBER,
  SUNDAY: () => SUNDAY,
  THURSDAY: () => THURSDAY,
  TIME_LENGTH: () => TIME_LENGTH,
  TO_NUMBER: () => TO_NUMBER,
  TUESDAY: () => TUESDAY,
  UNDEFINED: () => UNDEFINED,
  UNIQUE: () => UNIQUE,
  WEDNESDAY: () => WEDNESDAY,
  WEEK: () => WEEK,
  WEEKS_IN_YEAR: () => WEEKS_IN_YEAR,
  YES: () => YES,
  orderBy: () => orderBy,
  orderByDescending: () => orderByDescending
});
module.exports = __toCommonJS(src_exports);

// src/constants.ts
var UNDEFINED = Object.freeze({});
var OBJECT = Object.freeze({});
var JSON_OBJECT = JSON.stringify(OBJECT);
var ARRAY = Object.freeze([]);
var JSON_ARRAY = JSON.stringify(ARRAY);
var FOREVER = true;
var MAX_PERCENTAGE = 100;

// src/callbacks.ts
var NOOP = (_) => void 0;
var YES = () => true;
var NO = () => false;
var GET_ARRAY = () => ARRAY;
var GET_OBJECT = () => OBJECT;
var IDENTITY = (v) => v;
var IDENTITIES = (...v) => v;
var NOT = (v) => !v;
var HAS_ITEMS = (v) => Array.isArray(v) && v.length !== 0;
var SET_FILTER = (item, index, array) => array.indexOf(item) === index;
var SORT_NUMBER = (number, otherNumber) => number - otherNumber;
var TO_NUMBER = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : void 0;
};
var UNIQUE = (array) => Array.from(new Set(array));

// src/size.ts
var KB = 1024;
var MB = 1024 * KB;
var GB = 1024 * MB;

// src/date.ts
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

// src/op.ts
var OpState = /* @__PURE__ */ ((OpState2) => {
  OpState2["NONE"] = `none`;
  OpState2["PENDING"] = `pending`;
  OpState2["OK"] = `ok`;
  OpState2["ERROR"] = `error`;
  return OpState2;
})(OpState || {});

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
  NOT,
  OBJECT,
  OpState,
  SATURDAY,
  SECOND,
  SECONDS_IN_MINUTE,
  SET_FILTER,
  SORT_NUMBER,
  SUNDAY,
  THURSDAY,
  TIME_LENGTH,
  TO_NUMBER,
  TUESDAY,
  UNDEFINED,
  UNIQUE,
  WEDNESDAY,
  WEEK,
  WEEKS_IN_YEAR,
  YES,
  orderBy,
  orderByDescending
});
