const STATUS = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  DONE: 'Done',
};

const MESSAGES = {
  titleMissing: 'Please enter a title',
  confirmPastDueDate: 'The due date is in the past. Do you want to save the task anyway?',
};

class Group {
  constructor(name, members) {
    this.name = name;
    this.members = new Set(members);
    this.tasks = [];
  }

  createTask({ title, description = '', dueDate, assignee = null, today, confirmPastDueDate = false }) {
    if (!title || title.trim() === '') {
      return { saved: false, message: MESSAGES.titleMissing };
    }
    if (dueDate < today && !confirmPastDueDate) {
      return { saved: false, needsConfirmation: true, message: MESSAGES.confirmPastDueDate };
    }

    const task = {
      title: title.trim(),
      description,
      dueDate,
      assignee,
      status: STATUS.TODO,
    };
    this.tasks.push(task);
    return { saved: true, task };
  }

  dashboardFor(member) {
    return this.tasks.filter((task) => task.assignee === member);
  }
}

module.exports = { Group, STATUS, MESSAGES };
