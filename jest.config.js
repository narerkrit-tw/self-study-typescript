module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: "test/.*\\.ts$",
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1",
    "test/(.*)": "<rootDir>/test/$1"
  },
  setupFilesAfterEnv: ["jest-extended"]
}
