const { setWorldConstructor } = require('@cucumber/cucumber');

class StudyHubWorld {
  constructor() {
    this.lastResult = null;
    this.lastTaskInput = null;
  }
}

setWorldConstructor(StudyHubWorld);
