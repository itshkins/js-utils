const UNSET = Object.freeze({});
const OBJECT = Object.freeze({});
const JSON_OBJECT = JSON.stringify(OBJECT);
const ARRAY = Object.freeze([]);
const JSON_ARRAY = JSON.stringify(ARRAY);
const FOREVER = true;
const MAX_PERCENTAGE = 100;

const NOOP = (_) => void 0;
const YES = () => true;
const NO = () => false;
const TOGGLE = (v) => !v;
const GET_ARRAY = () => ARRAY;
const GET_OBJECT = () => OBJECT;
const IDENTITY = (v) => v;
const IDENTITIES = (...v) => v;
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

export { ARRAY, ASC, DATE_LENGTH, DATE_TIME_LENGTH, DAY, DAYS_IN_MONTH, DAYS_IN_WEEK, DAYS_IN_YEAR, DESC, FOREVER, FRIDAY, GB, GET_ARRAY, GET_OBJECT, HAS_ITEMS, HOUR, HOURS_IN_DAY, IDENTITIES, IDENTITY, JSON_ARRAY, JSON_OBJECT, KB, KeyboardCode, KeyboardKey, MAX_PERCENTAGE, MB, MINUTE, MINUTES_IN_HOUR, MONDAY, MONTH, NO, NOOP, OBJECT, OpStates, PB, SATURDAY, SECOND, SECONDS_IN_MINUTE, SET_FILTER, SORT_NUMBER, SUNDAY, TB, THURSDAY, TIME_LENGTH, TOGGLE, TO_NUMBER, TUESDAY, UNIQUE, UNSET, WEDNESDAY, WEEK, WEEKS_IN_YEAR, YES, findOpStateByName, orderBy, orderByDescending, runOp };
