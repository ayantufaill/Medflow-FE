const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Vite inlines this global at build time (see vite.config.js). Jest has no
// Vite, so it starts empty: every feature flag is off unless a test sets one.
global.__FEATURE_FLAGS__ = {};
