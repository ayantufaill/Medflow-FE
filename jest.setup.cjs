const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Vite inlines this global at build time (see vite.config.js). Jest has no
// Vite, so it starts empty: every feature flag is off unless a test sets one.
global.__FEATURE_FLAGS__ = {};

const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/utc'));
dayjs.extend(require('dayjs/plugin/timezone'));
dayjs.extend(require('dayjs/plugin/quarterOfYear'));
dayjs.extend(require('dayjs/plugin/isSameOrAfter'));
dayjs.extend(require('dayjs/plugin/isSameOrBefore'));
dayjs.extend(require('dayjs/plugin/relativeTime'));
dayjs.extend(require('dayjs/plugin/customParseFormat'));
