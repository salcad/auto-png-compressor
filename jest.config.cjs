module.exports = {
  preset: 'ts-jest/presets/default', // Use the ESM preset for ts-jest
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest', // Transform ES modules using Babel
    '^.+\\.mjs$': 'babel-jest', // Add this line to transform ES modules
  },
  transformIgnorePatterns: [
    '/node_modules/(?!pngquant-bin/)', // Exclude pngquant-bin from being ignored
  ],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
