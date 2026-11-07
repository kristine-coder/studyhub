# StudyHub: Software Requirements Specification

**Authors:** Ergens Hyso, Kristine Megrelishvili, Antonio Kanani                           **Date:** 15 Oct 2026

## Contents

1. [Introduction](#1-introduction)  
2. [Overall Description](#2-overall-description)  
3. [Specific Requirements](#3-specific-requirements)  
4. [Supporting Information](#4-supporting-information)

---

# 1\. Introduction

## 1.1 Purpose

This document describes what **StudyHub** must do. StudyHub is a web app that helps students keep their courses, deadlines and group work in one place. The document is for our team, our peer reviewers and our lecturers.

## 1.2 Scope

Group projects get chaotic: many group chats, hard-to-match schedules, notes spread over several apps. StudyHub puts it all in one place. It lets students:

- track their courses and deadlines,  
- see who is doing which task in a group,  
- see what is due next,  
- find a time when the whole group can meet,  
- keep shared notes for the group.

The use cases are shown in the [use case diagram](#22-use-case-diagram). StudyHub is **not** a learning management system (like Moodle), has no video calls and does no grading.

## 1.3 Definitions, Acronyms and Abbreviations

| Term | Meaning |
| :---- | :---- |
| SRS | Software Requirements Specification |
| RUP | Rational Unified Process |
| Student | A registered user of StudyHub |
| Group Owner | The student who created a study group and manages it |
| Study group | Students working together on a course or project |
| Task | A piece of work with a person responsible, a due date and a status |
| Deadline | A due date for a course or a task |
| Availability | The times a student can meet |
| GDPR | General Data Protection Regulation (EU data protection law) |

## 1.4 References

- [RUP SRS template](https://files.defcon.no/RUP/webtmpl/templates/req/rup_srs.htm)  
- [UML use case diagrams](https://www.uml-diagrams.org/use-case-diagrams.html)  
- IEEE Std 830-1998, *Recommended Practice for Software Requirements Specifications*  
- [StudyHub use case diagram](diagrams/use-case-diagram.png) ([PlantUML source](diagrams/use-case-diagram.puml))
- StudyHub use case specifications: [Create a task](use-cases/create-task.md), [Schedule meeting](use-cases/schedule-meeting.md)

## 1.5 Overview

Section 2 describes the product in general. Section 3 lists what the system must do and the quality it must have. Section 4 holds supporting information.

---

# 2\. Overall Description
## 2.1 Product Overview

**Product perspective.** StudyHub is a stand-alone web application (browser front end, server back end, database). It does not depend on any university system. It sends emails through an external email service.

**Main functions.** Students can register and log in, add courses and deadlines, create study groups and invite others, assign tasks, see a dashboard of what is due, enter their availability to find meeting times, write shared notes, and get reminders by email.

**Users.** University students, comfortable with web apps, no technical training needed. Some use it daily, others only before deadlines.

**Constraints.**

- Three students build it within one semester.  
- Documentation is written in Markdown and stored in Git, separate from the code.  
- Personal data must follow the GDPR.

**Assumptions.**

- Users have a modern browser, internet access and an email address.  
- Each student has their own account; there are no shared accounts.

**Priorities.** The first release has everything marked *High*. Items marked *Medium* or *Low* come later if time allows.

## 2.2 Use Case Diagram
![StudyHub use case diagram](diagrams/use-case-diagram.png)

The Group Owner "is a" Student. *Schedule meeting* always includes *Find common meeting time*. *Export calendar* and *Send reminders* are optional extensions. *Manage account* covers log out, reset password, edit profile and delete account.

---

# 3\. Specific Requirements

## 3.1 Functionality

### Accounts *(High)*

- A visitor can register with name, email and password and must confirm the email address.  
- A student can log in, log out and reset a forgotten password.  
- A student can edit their profile and delete their account with all their data.

### Courses and deadlines *(High)*

- A student can add, edit and delete courses.  
- A student can add, edit and delete deadlines for a course.  
- Deadlines that have passed are marked as overdue.

### Study groups *(High)*

- A student can create a study group and becomes its Group Owner.  
- A Group Owner can invite students by email or link and can remove members or delete the group.  
- An invited student can accept or decline.  
- A member can leave a group.

### Tasks *(High)*

- A group member can create a task with title, description, due date and a person responsible.  
- A task has the status *To do*, *In progress* or *Done*.  
- Members can edit, reassign and delete tasks.  
- The group can see who is doing which task.

### Dashboard *(High)*

- A student sees all upcoming deadlines and open tasks from every course and group, sorted by date.  
- Items due within 48 hours and overdue items are highlighted.  
- The list can be filtered by course or group.

### Availability and meetings *(Medium)*

- A student can enter when they are free or busy.  
- The system shows the times when all (or most) group members are free.  
- A member can create a meeting with title, time and place or link.  
- Members can accept or decline a meeting.

### Shared notes *(Medium)*

- Group members can create, edit, delete and search notes.  
- Only members of the group can see its notes.  
- Each note shows who changed it last and when.

### Notifications *(Medium)*

- Students get an email when a task is assigned to them, 24 hours before something is due, and when a meeting is created or changed.  
- Students can switch each kind of notification on or off.

### Calendar export *(Low)*

- A student can export deadlines, tasks and meetings as an iCalendar (.ics) file.

## 3.2 Usability

- A new user can register, create a group and add a first task within 5 minutes without help.  
- The interface works on desktop and on phones (from 360 px wide).  
- The interface follows WCAG 2.1 level AA (contrast, keyboard use).  
- The interface is in English; adding languages later must be possible.

## 3.3 Reliability

- The system is available at least 99 % of the time per month, not counting announced maintenance.  
- The database is backed up daily and can be restored to any day of the last 7 days.  
- If an action fails, no input is lost and the user sees a clear error message.

## 3.4 Performance

- 95 % of pages and actions respond within 2 seconds.  
- The system supports at least 500 users, 100 of them at the same time.  
- The dashboard loads within 3 seconds for a user with 20 courses and 200 tasks.

## 3.5 Supportability

- Code follows a written coding standard checked by a linter.  
- Code and documentation are in Git; documentation is in its own `docs/` folder.  
- The core functions (accounts, courses, groups, tasks, dashboard) have automated tests that run before changes are merged.

## 3.6 Design Constraints

- StudyHub is a web app for current Chrome, Firefox, Safari and Edge.  
- Passwords are stored only as salted hashes, and all traffic uses HTTPS.  
- Only data needed for the functions above is stored (GDPR).  
- The team works in small steps and reviews each other's changes before merging.

## 3.7 On-line User Documentation and Help System Requirements

A short getting-started guide and help texts for groups, tasks and meetings. No printed manual.

## 3.8 Purchased Components

None. We use open-source libraries and possibly the free tier of an email delivery service.

## 3.9 Interfaces

**User interfaces.** A responsive web interface with login and registration, dashboard, course view, group view (members, tasks, meetings, notes) and settings. Prototypes (mockups) will be added to this document in a later version.

**Hardware interfaces.** None.

**Software interfaces.** An email service (e.g. SMTP) sends confirmation, invitation and reminder emails. Calendar export uses the iCalendar format (RFC 5545).

**Communications interfaces.** Browser and server talk over HTTPS. The front end uses a REST/JSON interface to the back end.

## 3.10 Licensing Requirements

The source code gets an open-source license chosen by the team. Libraries must have compatible licenses.

## 3.11 Legal, Copyright and Other Notices

A privacy notice and terms of use are reachable from every page. Third-party copyright notices are listed where required.

## 3.12 Applicable Standards

GDPR (EU 2016/679), WCAG 2.1 level AA, RFC 5545 (iCalendar), IEEE Std 830-1998 as guidance for this document.

---

# 4\. Supporting Information

## 4.1 Use Case Specifications

| Use case | Specification | Automated tests |
| :---- | :---- | :---- |
| Create a task | [create-task.md](use-cases/create-task.md) | [create_task.feature](../features/create_task.feature) |
| Schedule meeting | [schedule-meeting.md](use-cases/schedule-meeting.md) | [schedule_meeting.feature](../features/schedule_meeting.feature) |

## 4.2 Revision History

| Date | Version | Change |
| :---- | :---- | :---- |
| 15 Oct 2026 | 1.0 | First version |
| 7 Nov 2026 | 1.1 | Fixed broken links and the empty 2.1 heading, added *Manage account* to the use case diagram, linked the use case specifications and tests |
| 8 Nov 2026 | 1.2 | Replaced the *Log in* specification with *Schedule meeting*, renamed *Manage tasks (create a task)* to *Create a task* |

## 4.3 Team

* Ergens Hyso
* Antonio Kanani
* Kristine Megrelishvili
