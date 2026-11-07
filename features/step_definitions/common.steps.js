const assert = require('node:assert/strict');
const { Then } = require('@cucumber/cucumber');

Then('the message {string} is shown', function (message) {
  assert.equal(this.lastResult.message, message);
});
