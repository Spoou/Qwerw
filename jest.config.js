module.exports = {
  preset: "react-native",
  moduleFileExtensions: ["ts", "tsx", "js"],
  moduleNameMapper: {
    "^lib/(.*)": "<rootDir>/src/lib/$1",
    "^palette$": "<rootDir>/src/palette",
    "^palette/(.*)": "<rootDir>/src/palette/$1",
    "@images/(.*)": "<rootDir>/images/$1",
    "@relay/(.*)": "<rootDir>/src/lib/relay/$1",
  },
  testMatch: ["<rootDir>/src/**/__tests__/*tests.(ts|tsx|js)"],
  testEnvironment: "jsdom",
  testURL: "http://localhost/",
  setupFilesAfterEnv: ["./src/setupJest.ts"],
  cacheDirectory: ".jest/cache",
  transform: {
    "^[./a-zA-Z0-9$_-]+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp)$":
      "<rootDir>/node_modules/react-native/jest/assetFileTransformer.js",
    ".*(ts|tsx|js|jsx)$": "babel-jest",
    "\\.graphql$": "jest-raw-loader",
  },
  transformIgnorePatterns: ["node_modules/(?!(react-native(-.*)?/(@react-native-community/.*))?|react-navigation|@react-navigation/.*)"],
}
