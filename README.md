# StudyHub

Group projects and study sessions can quickly become frustratingly chaotic. Between juggling different group chats, trying to align everyone's schedules, and losing important notes across multiple apps, students end up wasting half their energy just trying to stay organized. Instead of focusing on learning, everyone gets bogged down by the logistics.

That is the exact problem we set out to solve. The three of us, Ergens Hyso, Kristine Megrelishvili and Antonio Kanani, built StudyHub to fix this friction and make group collaboration effortless.

StudyHub helps students keep track of their courses, deadlines, and group work in one place. It shows who is doing what, what is due next, and when the group can meet, so teams spend less time coordinating and more time learning.

## Documentation

- [Software Requirements Specification](docs/SRS.md)
- [Use case diagram](docs/diagrams/use-case-diagram.png) ([PlantUML source](docs/diagrams/use-case-diagram.puml))
- Use case specifications: [Create a task](docs/use-cases/create-task.md), [Schedule meeting](docs/use-cases/schedule-meeting.md)

## Blog

- [Week 1: Introducing StudyHub](docs/blog/week-01-introduction.md)
- [Week 2: Our Team, Technology and Project Setup](docs/blog/week-02-team-technology-setup.md)
- [Week 3: From Idea to Requirements, Our SRS and Use Case Diagram](docs/blog/week-03-requirements-and-use-cases.md)
- [Week 4: From Use Case Diagram to Use Case Specification](docs/blog/week-04-use-case-specification.md)
- [Week 5: Testing StudyHub with Cucumber](docs/blog/week-05-testing-with-cucumber.md)

## Running the tests

The use cases are tested with [CucumberJS](https://github.com/cucumber/cucumber-js). You need Node.js 20 or newer.

```bash
npm install
npm test
```

The tests also run on GitHub for every push and pull request.

StudyHub itself does not exist yet. The step definitions test a small in-memory model of the app in `src/`. When the real app exists, only the step definitions change; the feature files stay the same.

## Repository structure

```text
docs/
  SRS.md               requirements
  use-cases/           one file per use case, with its activity diagram
  diagrams/            use case diagram (PlantUML source and PNG)
  blog/                weekly blog posts
features/
  *.feature            Gherkin scenarios, one file per use case
  step_definitions/    code that connects each step to the model
  support/             test setup (fake clock and fake mailer)
src/                   in-memory model of StudyHub used by the tests
```

## Team

Ergens Hyso, Kristine Megrelishvili, Antonio Kanani
