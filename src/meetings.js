const RESPONSE = {
  NONE: 'No answer yet',
  ACCEPTED: 'Accepted',
  DECLINED: 'Declined',
};

class MeetingPlanner {
  constructor(members) {
    this.members = [...members];
    this.availability = new Map();
    this.meetings = [];
  }

  setAvailability(member, freeTimes) {
    this.availability.set(member, new Set(freeTimes));
  }

  findCommonTimes() {
    const freeCount = new Map();
    for (const times of this.availability.values()) {
      for (const time of times) {
        freeCount.set(time, (freeCount.get(time) ?? 0) + 1);
      }
    }

    if (freeCount.size === 0) {
      return { mode: 'choose-freely', times: [] };
    }

    const best = Math.max(...freeCount.values());
    const times = [...freeCount.keys()].filter((time) => freeCount.get(time) === best).sort();
    const mode = best === this.members.length ? 'all-free' : 'most-free';
    return { mode, times, freeMembers: best, totalMembers: this.members.length };
  }

  scheduleMeeting({ title, time, place }) {
    const responses = new Map(this.members.map((member) => [member, RESPONSE.NONE]));
    const meeting = { title, time, place, responses };
    this.meetings.push(meeting);
    return meeting;
  }

  respond(meeting, member, accepts) {
    meeting.responses.set(member, accepts ? RESPONSE.ACCEPTED : RESPONSE.DECLINED);
  }
}

module.exports = { MeetingPlanner, RESPONSE };
