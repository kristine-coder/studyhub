const assert = require('node:assert/strict');
const { Given, When, Then } = require('@cucumber/cucumber');
const { Group } = require('../../src/tasks');

function createTask(world, input) {
  world.lastTaskInput = input;
  world.lastResult = world.group.createTask({ ...input, today: world.today });
}

function findTask(world, title) {
  const task = world.group.tasks.find((t) => t.title === title);
  assert.ok(task, `Task "${title}" was not saved`);
  return task;
}

Given('today is {string}', function (date) {
  this.today = date;
});

Given(
  'a study group {string} with the members {string}, {string} and {string}',
  function (name, first, second, third) {
    this.group = new Group(name, [first, second, third]);
  },
);

Given('{string} is logged in and opens the group', function (member) {
  assert.ok(this.group.members.has(member), `${member} is not a member of the group`);
  this.currentMember = member;
});

When(
  'she creates a task with the title {string} and the due date {string} for {string}',
  function (title, dueDate, assignee) {
    createTask(this, { title, dueDate, assignee });
  },
);

When(
  'she creates a task with the title {string} and the due date {string} for nobody',
  function (title, dueDate) {
    createTask(this, { title, dueDate, assignee: null });
  },
);

When('she confirms the due date', function () {
  createTask(this, { ...this.lastTaskInput, confirmPastDueDate: true });
});

Then('the task {string} is saved with the status {string}', function (title, status) {
  assert.equal(findTask(this, title).status, status);
});

Then('the task {string} is saved as unassigned', function (title) {
  assert.equal(findTask(this, title).assignee, null);
});

Then('the task {string} is shown in the group view', function (title) {
  assert.ok(this.group.tasks.some((t) => t.title === title));
});

Then('the task {string} is on the dashboard of {string}', function (title, member) {
  const titles = this.group.dashboardFor(member).map((t) => t.title);
  assert.deepEqual(titles, [title]);
});

Then('she is asked to confirm the due date', function () {
  assert.equal(this.lastResult.needsConfirmation, true);
});

Then('no task is saved', function () {
  assert.equal(this.group.tasks.length, 0);
});
