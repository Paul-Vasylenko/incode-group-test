'use strict';

global.console = {
  ...console,
  // eslint-disable-next-line no-undef
  error: jest.fn(),
};
