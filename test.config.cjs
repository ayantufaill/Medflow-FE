module.exports = {
    testEnvironment: "jsdom",
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