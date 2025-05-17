module.exports = {
  preset: 'jest-expo',
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo|@expo|@unimodules|unimodules|sentry-expo|native-base|@react-native-community|@react-native-picker|@react-native-async-storage|@react-native-masked-view|@react-native-segmented-control|@react-native-clipboard|@react-native-firebase|@react-native-google-signin|@react-native-community|@react-native-vector-icons|react-navigation-tabs|react-navigation-stack|react-navigation|@react-navigation/.*|@react-native/.*|@react-native-community/.*)'
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
