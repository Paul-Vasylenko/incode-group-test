'use strict';
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: ['default'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};
