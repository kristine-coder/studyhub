const { setWorldConstructor } = require('@cucumber/cucumber');
const { AuthService } = require('../../src/auth');

class FakeMailer {
  constructor() {
    this.sent = [];
  }

  send(email) {
    this.sent.push(email);
  }
}

class StudyHubWorld {
  constructor() {
    this.currentTime = Date.UTC(2026, 10, 7, 9, 0);
    this.mailer = new FakeMailer();
    this.auth = new AuthService({ mailer: this.mailer, now: () => this.currentTime });
    this.page = null;
    this.lastResult = null;
    this.lastTaskInput = null;
  }
}

setWorldConstructor(StudyHubWorld);
