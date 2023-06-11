'use strict';
const { SummaryReporter } = require('@jest/reporters');

class CustomReporter extends SummaryReporter {
  constructor(globalConfig, options) {
    super(globalConfig, options);
    this.failedTests = [];
  }

  // Custom method to log to console only when a test fails
  logOnTestFailure(testResult) {
    if (testResult.numFailedTests > 0) {
      const { testResults: suiteResults } = testResult;
      for (const suiteResult of suiteResults) {
        const { testResults } = suiteResult;
        for (const result of testResults) {
          if (result.status === 'failed') {
            console.log(`Test Failed: ${result.fullName}`);
            console.log(`Error: ${result.failureMessages.join('\n')}`);
            console.log('---');
          }
        }
      }
    }
  }

  // Override onRunComplete to log test failure information
  onRunComplete(contexts, results) {
    super.onRunComplete(contexts, results);
    this.logOnTestFailure(results);
  }
}

module.exports = CustomReporter;
