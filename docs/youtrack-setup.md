# YouTrack setup for StudyHub (Week 6)

Follow this list until every grading item has a check. Paste public links and screenshots into `docs/blog/week-06-in-progress.md`.

## 1. Project and public board

- [x] Create a YouTrack Cloud project (key **STU**, name StudyHub).
- [x] Scrum agile board: https://kristine2473.youtrack.cloud/projects/STU/agiles/204-1/current
- [x] Grant **Issue Reader** (or read-only role) to All Users / Registered Users.
- [x] Share dashboard: All Users can view.
- [x] Paste the public board URL into the Week 6 blog.

## 2. Custom fields (RUP + UC)

- [x] **Phase** — values: `Inception`, `Elaboration`.
- [x] **Workflow** — values: `Requirements`, `Analysis & Design`, `Implementation`, `Test`, `Project Management`.
- [x] **Use case** — values: `UC-CreateTask`, `UC-ScheduleMeeting` (empty allowed).
- [x] Enable **Estimated time** on issues.
- [x] Add **In Progress Work Timer** workflow for time tracking.
- [ ] Optional: allow multiple assignees if the team wants it; still assign a primary owner per task for grading.

## 3. Sprint Elaboration#1

- [x] Create sprint named exactly **`Elaboration#1`**.
- [x] Set start and end dates (11–18 Nov 2026).
- [x] Move the Week 6 task list onto the sprint (see the blog table).
- [x] Every sprint task: **assignee**, **Estimated time**, **Phase**, **Workflow**, **Use case** when relevant.
- [x] First burn-down report exists for Elaboration#1 (screenshot still needed in blog).
- [x] Cumulative flow by **Workflow** (RUP colours) — day-1 spike is OK.
- [ ] Click **Start sprint** on Elaboration#1 if not started yet.

## 4. Dashboard

- [x] Create a dashboard: StudyHub Elaboration#1.
- [x] Add burn-down as a Report widget.
- [x] Add cumulative flow (by Workflow) as a Report widget.
- [x] Share via `…` next to dashboard title: All Users = view.
- [x] Dashboard URL: https://kristine2473.youtrack.cloud/dashboard?id=177-3
- [ ] Paste screenshots into the Week 6 blog.

## 5. IDE integration

- [x] WebStorm: **Settings → Tools → Tasks → Servers** → YouTrack connected (Open Task works).
- [x] Changelist format `${id} ${summary}` (issue ID in commits).
- [ ] Use **Start Task** → status In Progress + timer (+ optional branch) — demo once for screenshot.
- [ ] When finished, change status so spent time is stored.
- [ ] Screenshot of Servers settings (no token) into the blog.

## 6. Git / GitHub integration

- [x] YouTrack **Version Control**: GitHub `kristine-coder/studyhub` connected.
- [x] Commit message includes `STU-9 …` (local commit `4c59a77`; push to GitHub still needed for YouTrack VCS).
- [ ] Confirm the commit appears on the YouTrack issue (after push).
- [ ] If something cannot be automated, write one sentence in the blog explaining why.

## 7. Midterm report readiness (tags must exist now)

Filters / reports you will need later:

- [ ] Time spent per **use case** (UC field / tag).
- [ ] Time spent per **person** (assignee + work items).
- [ ] Time spent per **workflow** (Workflow field).

## Tips from the course sheet

- Swimlanes and Use-Case tags help the board stay readable.
- Use **depends on** and **subtask of** in the issue editor when useful.
- Delete local change-lists at the end of the day in the IDE.
- Do not invent a perfect burn-down; honest estimates and tags matter more this week.
