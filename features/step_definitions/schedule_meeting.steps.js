const assert = require('node:assert/strict');
const { Given, When, Then } = require('@cucumber/cucumber');
const { MeetingPlanner, RESPONSE } = require('../../src/meetings');

const STATUS = {
  accepted: RESPONSE.ACCEPTED,
  declined: RESPONSE.DECLINED,
};

Given(
  'a study group with the members {string}, {string} and {string}',
  function (first, second, third) {
    this.planner = new MeetingPlanner([first, second, third]);
  },
);

Given('{string} opens the group and chooses "Schedule meeting"', function (member) {
  assert.ok(this.planner.members.includes(member), `${member} is not a member of the group`);
  this.currentMember = member;
});

Given('{string} is free on {string} and {string}', function (member, first, second) {
  this.planner.setAvailability(member, [first, second]);
});

Given('she scheduled {string} at {string} in {string}', function (title, time, place) {
  this.meeting = this.planner.scheduleMeeting({ title, time, place });
});

When('StudyHub looks for a common meeting time', function () {
  this.suggestion = this.planner.findCommonTimes();
});

When('she schedules {string} at {string} in {string}', function (title, time, place) {
  this.meeting = this.planner.scheduleMeeting({ title, time, place });
});

When('{string} accepts the meeting', function (member) {
  this.planner.respond(this.meeting, member, true);
});

When('{string} declines the meeting', function (member) {
  this.planner.respond(this.meeting, member, false);
});

Then('the suggested times are {string}', function (times) {
  assert.deepEqual(this.suggestion.times, times.split(', '));
});

Then('all {int} members are free at the suggested times', function (count) {
  assert.equal(this.suggestion.mode, 'all-free');
  assert.equal(this.suggestion.freeMembers, count);
});

Then('StudyHub shows that {int} of {int} members are free', function (free, total) {
  assert.equal(this.suggestion.mode, 'most-free');
  assert.equal(this.suggestion.freeMembers, free);
  assert.equal(this.suggestion.totalMembers, total);
});

Then('{string} is asked to choose a time freely', function (member) {
  assert.equal(this.currentMember, member);
  assert.equal(this.suggestion.mode, 'choose-freely');
});

Then(
  'the meeting {string} is shown to {string}, {string} and {string}',
  function (title, first, second, third) {
    for (const member of [first, second, third]) {
      assert.ok(this.meeting.responses.has(member), `${member} does not see the meeting`);
    }
    assert.equal(this.planner.meetings.find((m) => m.title === title), this.meeting);
  },
);

Then('nobody has answered the meeting yet', function () {
  for (const response of this.meeting.responses.values()) {
    assert.equal(response, RESPONSE.NONE);
  }
});

Then('the group sees that {string} has {word} the meeting', function (member, status) {
  assert.equal(this.meeting.responses.get(member), STATUS[status]);
});
