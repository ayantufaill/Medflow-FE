/**
 * Feature flags, read through one module.
 *
 * WHY NOT `import.meta.env` DIRECTLY: that is ESM-only syntax, and Babel
 * cannot transform it for the Jest (CommonJS) test run — any component that
 * imports a module containing it becomes untestable. So Vite inlines the flag
 * values at build time into `globalThis.__FEATURE_FLAGS__` (see
 * `vite.config.js`), and the test setup defines the same global as `{}`.
 * `globalThis` access is valid in both worlds and needs no mocking.
 */

const flags = () => globalThis.__FEATURE_FLAGS__ || {};

/**
 * Automatic eligibility check (clearinghouse). Off until a clearinghouse is
 * integrated; the UI placeholder is already wired behind it.
 */
export const isAutoEligibilityEnabled = () => flags().autoEligibility === true;

export default { isAutoEligibilityEnabled };
