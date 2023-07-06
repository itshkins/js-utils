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
var TB = 1024 * GB;
var PB = 1024 * TB;

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
  NOT,
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
  TIME_LENGTH,
  TO_NUMBER,
  TUESDAY,
  UNDEFINED,
  UNIQUE,
  WEDNESDAY,
  WEEK,
  WEEKS_IN_YEAR,
  YES,
  findOpStateByName,
  orderBy,
  orderByDescending,
  runOp
};
