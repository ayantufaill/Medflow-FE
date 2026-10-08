module.exports = {
  testEnvironment: "jsdom",
  // Only *.test.* files are suites. The default also treats every file under
  // __tests__/ as a suite, which would make shared render helpers fail with
  // "your test suite must contain at least one test".
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  // Agent worktrees under .claude/ contain a full copy of the repo (package.json,
  // __mocks__), which collides with the real one in jest-haste-map. Hide them.
  modulePathIgnorePatterns: ["<rootDir>/.claude/"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/.claude/",
    // Authored against vitest (imports from 'vitest'); run it with `npm run test:vitest`.
    "<rootDir>/src/config/navMenuItems.test.jsx",
  ],
  // The COB integration suites drive full MUI dialogs through userEvent (which
  // advances real timers between keystrokes). They finish in ~2s alone but can
  // pass 5s when 13 suites run in parallel, so the default timeout is too tight
  // for them — this is a scheduling budget, not slow code.
  testTimeout: 30000,
  setupFiles: ["./jest.setup.cjs"],
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg|ico)$": "<rootDir>/__mocks__/fileMock.cjs",
  },
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(use-debounce)/)",
  ],
};
