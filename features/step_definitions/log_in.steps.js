const assert = require('node:assert/strict');
const { Given, When, Then } = require('@cucumber/cucumber');

const WRONG_PASSWORD = 'definitely-wrong';

function logIn(world, email, password) {
  world.lastResult = world.auth.logIn(email, password);
  if (world.lastResult.ok) {
    world.page = world.lastResult.page;
  }
}

Given('a student account {string} with password {string}', function (email, password) {
  this.email = email;
  this.auth.register({ name: 'Kristine', email, password });
});

Given('the email address {string} is confirmed', function (email) {
  this.auth.accounts.get(email).confirmed = true;
});

Given('the student is on the login page', function () {
  this.page = 'login';
});

Given('the student entered a wrong password {int} times', function (times) {
  for (let i = 0; i < times; i += 1) {
    logIn(this, this.email, WRONG_PASSWORD);
  }
});

When('the student logs in with {string} and {string}', function (email, password) {
  logIn(this, email, password);
});

When('the student enters a wrong password {int} times', function (times) {
  for (let i = 0; i < times; i += 1) {
    logIn(this, this.email, WRONG_PASSWORD);
  }
});

When('{int} minutes pass', function (minutes) {
  this.currentTime += minutes * 60 * 1000;
});

When('the student asks to resend the confirmation email', function () {
  this.auth.resendConfirmation(this.email);
});

When('the student chooses "Forgot password" for {string}', function (email) {
  this.lastResult = this.auth.requestPasswordReset(email);
});

Then('the student sees the dashboard', function () {
  assert.equal(this.lastResult.ok, true);
  assert.equal(this.page, 'dashboard');
});

Then('the student stays on the login page', function () {
  assert.equal(this.page, 'login');
});

Then('the student is offered to resend the confirmation email', function () {
  assert.equal(this.lastResult.offerResendConfirmation, true);
});

Then('a {string} email is sent to {string}', function (type, email) {
  assert.deepEqual(this.mailer.sent, [{ to: email, type }]);
});
