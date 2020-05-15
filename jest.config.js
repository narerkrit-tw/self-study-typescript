module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: "test/.*\\.ts$",
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1",
    "test/(.*)": "<rootDir>/__tests__/$1"
  },
  setupFilesAfterEnv: ["jest-extended"]
}
