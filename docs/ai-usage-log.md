# AI usage log

A factual record of what an AI assistant produced in this repository, so the team can check it and write their own reflections. This file is **not** a reflection on AI use. The reflections are in each blog post and are written by the team.

## 7 Nov 2026: rebuilding the repository

**Tool:** AI coding assistant in the Cursor editor (Claude).

**What it produced:**

- The project setup: `package.json`, `cucumber.js`, `.gitignore` and the GitHub Actions workflow `.github/workflows/test.yml`.
- The in-memory model in `src/auth.js` and `src/tasks.js`.
- The feature files `features/log_in.feature` and `features/create_task.feature` (14 scenarios), and all step definitions in `features/step_definitions/` and `features/support/`.
- The PlantUML source of the use case diagram and the rendered PNG. It added the *Manage account* use case.
- The Mermaid activity diagrams in `docs/use-cases/`.
- Edits to the team's existing documents: it moved the files into `docs/`, fixed broken links and the empty SRS heading 2.1, and turned the three use cases in the Week 4 post into separate files. It updated the Week 5 post to match the new tests and removed the old AI section and the screenshot placeholders.

**Rules it chose that were not in our specifications** (the team needs to accept or change them):

- A successful password check resets the wrong-attempt count to zero.
- When the 10-minute block ends, the count starts again from zero.
- The "Forgot password" message is the same whether or not the email belongs to an account.
- The precondition "Members have entered their availability" was removed from *Schedule meeting*, because alternative flow 2b says nobody has entered availability.

**How it was checked:** `npm test` passed with 14 scenarios. It then changed two rules in the model on purpose (six attempts instead of five, no confirmation for past due dates). Three scenarios failed, and they passed again after the change was undone.

## 7 Nov 2026: blog posts for weeks 1 to 3

**Tool:** AI coding assistant in the Cursor editor (Claude).

**What it produced:** drafts of `docs/blog/week-01-introduction.md`, `docs/blog/week-02-team-technology-setup.md` and `docs/blog/week-03-requirements-and-use-cases.md`. The week structure (introduction; team, technology and setup; requirements and use case diagram) follows the blog of another team in the course. No text was taken from that blog.

**Where the content comes from:** only from the team's README, SRS and Git history. Week 1 uses the README and SRS sections 1.2 and 2.1. Week 2 uses SRS sections 2.1, 3.5, 3.6 and 3.9. Week 3 summarises the SRS and the use case diagram.

**What it did not write:** the team roles, the chosen languages and frameworks, and the planning tool in week 2 are marked "To do (team)", because they are team decisions that are not written down anywhere. The AI reflections in all three posts are left for the team.
