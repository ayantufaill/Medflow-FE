/**
 * Local ESLint plugin: `medflow-dates/no-host-dates`.
 *
 * The clinic stores appointment/clinical datetimes as pseudo-instants: the UTC
 * wall-clock equals the clinic's wall-clock. Formatting those values with the
 * host machine's local time makes a clinic's schedule shift by a day depending
 * on where the browser or server happens to run, so every date read has to be
 * pinned to UTC explicitly.
 *
 * This rule flags the three ways that pinning gets forgotten:
 *   1. `dayjs(value).format(...)`   - formats in the host's local zone
 *   2. `value.toLocaleDateString()` - formats in the host's local zone
 *   3. `value.toLocaleString({ ...date options })` - same, via date options
 *
 * Currency formatting (`toLocaleString` with `style: 'currency'`, fraction
 * digits, grouping) is deliberately allowed: it carries no date semantics.
 *
 * The rule is a guard rail, not a formatter: it points at the shared helpers
 * in `src/utils/dateUtils.js` (`formatBranchDate`, `formatBranchDateTime`,
 * `formatBranchDateLong`, `formatBranchTime`, `branchDateStr`) instead of
 * trying to rewrite the call site.
 */

/** Option keys that make a `toLocaleString` call a date formatting call. */
const DATE_OPTION_KEYS = [
  'dateStyle',
  'timeStyle',
  'weekday',
  'era',
  'year',
  'month',
  'day',
  'hour',
  'minute',
  'second',
  'fractionalSecondDigits',
  'timeZoneName',
  'dayPeriod',
];

/** Files that are allowed to touch dates directly. */
const EXEMPT_FILES = ['src/utils/dateUtils.js', 'src/config/dayjs.js'];

/**
 * Walks a member/call chain down to its base and collects the property names
 * used along the way, so `dayjs(x).utc().format()` reports base `dayjs` and
 * names `['utc']`.
 */
function unwrapChain(node) {
  const names = [];
  let current = node;
  while (current) {
    if (current.type === 'CallExpression') {
      current = current.callee;
    } else if (current.type === 'MemberExpression') {
      const name = current.computed
        ? current.property.type === 'Literal'
          ? current.property.value
          : null
        : current.property.name;
      if (name) names.unshift(name);
      current = current.object;
    } else {
      break;
    }
  }
  return { base: current, names };
}

/** True when the call is a plain `dayjs(...)` construction. */
function isDayjsBase(base) {
  return base?.type === 'Identifier' && base.name === 'dayjs';
}

/** Finds the options object of a `toLocale*` call, if it is a literal. */
function findOptionsObject(args) {
  for (const arg of args) {
    if (arg.type === 'ObjectExpression') return arg;
  }
  return null;
}

/**
 * True when an argument is something we cannot inspect (a variable holding
 * the options). The rule then stays quiet rather than guessing.
 */
function hasUnknownOptions(args) {
  return args.some(
    (arg) =>
      arg.type === 'Identifier' ||
      arg.type === 'MemberExpression' ||
      arg.type === 'CallExpression',
  ) && !args.some((arg) => arg.type === 'Identifier' && arg.name === 'undefined');
}

/** Reads a property name from an object expression property. */
function propertyName(property) {
  if (property.type !== 'Property') return null;
  if (property.computed) return property.key.type === 'Literal' ? property.key.value : null;
  return property.key.name ?? (property.key.type === 'Literal' ? property.key.value : null);
}

const noHostDates = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow formatting dates in the host machine\'s local timezone; pin them to UTC.',
    },
    schema: [],
    messages: {
      localFormat:
        'This formats the date in the host machine\'s local timezone. Use a branch-safe helper from src/utils/dateUtils.js (e.g. formatBranchDate, formatBranchDateTime, formatBranchDateLong, formatBranchTime) or format the UTC value explicitly.',
      localToLocaleDate:
        'toLocaleDateString() without an explicit timeZone uses the host machine\'s local timezone. Pass timeZone: \'UTC\' in the options object, or use a branch-safe helper from src/utils/dateUtils.js.',
      localToLocaleString:
        'toLocaleString() with date options but no timeZone uses the host machine\'s local timezone. Add timeZone: \'UTC\' to the options object, or use a branch-safe helper from src/utils/dateUtils.js.',
    },
  },

  create(context) {
    const filename = context.filename ?? context.getFilename();
    const relative = filename.replace(/\\/g, '/');
    if (EXEMPT_FILES.some((exempt) => relative.endsWith(exempt))) return {};

    return {
      // 1. dayjs(value).format(...) without an explicit .utc()/.tz()
      CallExpression(node) {
        const { callee } = node;
        if (callee.type !== 'MemberExpression') return;
        if (callee.computed) return;
        if (callee.property.type !== 'Identifier' || callee.property.name !== 'format') return;

        const { base, names } = unwrapChain(callee.object);
        if (!isDayjsBase(base)) return;
        if (names.includes('utc') || names.includes('tz')) return;

        context.report({ node: callee, messageId: 'localFormat' });
      },

      // 2. value.toLocaleDateString() without an explicit timeZone
      // 3. value.toLocaleString({ ...date options }) without an explicit timeZone
      'CallExpression > MemberExpression'(node) {
        const { property, computed } = node;
        if (computed || property.type !== 'Identifier') return;
        const method = property.name;
        if (method !== 'toLocaleDateString' && method !== 'toLocaleString') return;

        const parent = node.parent;
        if (parent?.type !== 'CallExpression' || parent.callee !== node) return;

        const args = parent.arguments;
        const options = findOptionsObject(args);
        const hasTimeZone = Boolean(
          options?.properties.some((p) => propertyName(p) === 'timeZone'),
        );
        if (hasTimeZone) return;

        if (method === 'toLocaleDateString') {
          if (options === null && hasUnknownOptions(args)) return;
          context.report({ node, messageId: 'localToLocaleDate' });
          return;
        }

        // toLocaleString: only a date call is a problem. Currency and other
        // number formatting carry no date semantics and stay allowed.
        if (options === null) return;
        if (hasUnknownOptions(args)) return;
        const isDateCall = options.properties.some((p) => {
          const name = propertyName(p);
          return name !== null && DATE_OPTION_KEYS.includes(name);
        });
        if (!isDateCall) return;

        context.report({ node, messageId: 'localToLocaleString' });
      },
    };
  },
};

export default {
  meta: { name: 'medflow-dates', version: '1.0.0' },
  rules: { 'no-host-dates': noHostDates },
};
