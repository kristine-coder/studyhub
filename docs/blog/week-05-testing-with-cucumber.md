# Week 5: Testing StudyHub with Cucumber

*By Ergens Hyso, Kristine Megrelishvili and Antonio Kanani*

This week we looked at testing. Our StudyHub use cases are now written as **Gherkin feature files** that a computer can run, using **Cucumber**. We wrote two feature files, one for **Log in** and one for **Manage tasks**. Each has several scenarios, and all of them run and pass. The feature files, the step definitions and the code they test are all in our Git repository, so anyone can run them.

## What is Gherkin and BDD?

**BDD (behaviour-driven development)** means we describe what the software should do in plain language *before* we build it. **Gherkin** is the language for that. Everybody in the team can read it, including people who don't write code, and a tool such as Cucumber can run it as an automated test.

A feature file looks like this (taken from [`features/log_in.feature`](../../features/log_in.feature)):

```gherkin
Feature: Log in
  As a Student
  I want to log in to StudyHub with my email and password
  So that I can see my dashboard

  Background:
    Given a student account "kristine@example.com" with password "Secret123"
    And the student is on the login page

  Scenario: Successful login with valid credentials
    Given the email address "kristine@example.com" is confirmed
    When the student logs in with "kristine@example.com" and "Secret123"
    Then the student sees the dashboard
```

| Keyword | Meaning |
| :---- | :---- |
| **Feature** | The use case that is tested, with the actor and the goal |
| **Background** | Steps that run before every scenario in the file |
| **Scenario** | One concrete example of the use case |
| **Scenario Outline** | One scenario that runs once for each row of an **Examples** table |
| **Given** | The starting situation |
| **When** | What the user does |
| **Then** | What we expect to happen |
| **And** | Adds another step to Given, When or Then |

Each line is connected to a small piece of code, a **step definition**. The sentence is the specification, the step definition is the test, and so the documentation always shows whether the requirement still works. It is living documentation.

## Our two use cases

For each use case we have a narration, an activity diagram and a feature file. The full details are in our use case specifications for [Log in](../use-cases/log-in.md) and [Manage tasks](../use-cases/create-task.md).

### Log in

The [activity diagram](../use-cases/log-in.md#activity-diagram) shows one happy path and several unhappy paths. Every path has a scenario:

| Path in the activity diagram | Scenario |
| :---- | :---- |
| Valid credentials, confirmed email, dashboard | Successful login with valid credentials |
| Wrong email or password | Login is rejected for wrong credentials (a *Scenario Outline* with 2 examples) |
| Valid credentials, email not confirmed | Login is rejected when the email address is not confirmed |
| Resend the confirmation email | The confirmation email is sent again on request |
| Fifth wrong attempt | Login is blocked after five wrong attempts |
| Login blocked, correct password | A blocked student cannot log in even with the correct password |
| Block has run out | The block ends after 10 minutes |
| Forgot password | Forgot password |

### Manage tasks (create a task)

The [activity diagram](../use-cases/create-task.md#activity-diagram) has these paths:

| Path in the activity diagram | Scenario |
| :---- | :---- |
| Title and person entered | Create a task with a person responsible |
| Title entered, nobody chosen | Create a task without a person responsible |
| Title missing | A task without a title is not saved |
| Due date in the past, not confirmed | A due date in the past must be confirmed |
| Due date in the past, confirmed | A confirmed due date in the past is saved |

```gherkin
Scenario: A task without a title is not saved
  When she creates a task with the title "" and the due date "2026-11-20" for "Antonio"
  Then the message "Please enter a title" is shown
  And no task is saved
```

## Running the tests

We use **CucumberJS**. After `npm install`, this is the result of `npm test`:

```text
14 scenarios (14 passed)
81 steps (81 passed)
```

Cucumber also writes an HTML report to `reports/cucumber-report.html`.

StudyHub itself doesn't exist yet, so for now our step definitions test a small in-memory model of the app in the [`src/`](../../src) folder. Once we have a real interface, we change only the step definitions, not the feature files. The scenarios stay the same.

## Reflection on AI use

> **To do (team):** write this section yourselves, in your own words. Do not generate it with AI.
