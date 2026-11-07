Feature: Manage tasks (create a task)
  As a group member
  I want to put a piece of work on the board and say who does it
  So that the group knows who is doing what

  Background:
    Given today is "2026-11-07"
    And a study group "Software Engineering" with the members "Ergens", "Kristine" and "Antonio"
    And "Kristine" is logged in and opens the group

  Scenario: Create a task with a person responsible
    When she creates a task with the title "Write SRS" and the due date "2026-11-20" for "Antonio"
    Then the task "Write SRS" is saved with the status "To do"
    And the task "Write SRS" is shown in the group view
    And the task "Write SRS" is on the dashboard of "Antonio"

  Scenario: Create a task without a person responsible
    When she creates a task with the title "Draw diagrams" and the due date "2026-11-20" for nobody
    Then the task "Draw diagrams" is saved as unassigned
    And the task "Draw diagrams" is shown in the group view

  Scenario: A task without a title is not saved
    When she creates a task with the title "" and the due date "2026-11-20" for "Antonio"
    Then the message "Please enter a title" is shown
    And no task is saved

  Scenario: A due date in the past must be confirmed
    When she creates a task with the title "Old task" and the due date "2026-11-01" for "Antonio"
    Then she is asked to confirm the due date
    And no task is saved

  Scenario: A confirmed due date in the past is saved
    When she creates a task with the title "Old task" and the due date "2026-11-01" for "Antonio"
    And she confirms the due date
    Then the task "Old task" is saved with the status "To do"
