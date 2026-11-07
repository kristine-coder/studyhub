Feature: Schedule meeting
  As a group member
  I want to schedule a meeting at a time that works for everyone
  So that the whole group can meet without comparing timetables by hand

  Background:
    Given a study group with the members "Ergens", "Kristine" and "Antonio"
    And "Kristine" opens the group and chooses "Schedule meeting"

  Scenario: StudyHub lists the times when all members are free
    Given "Ergens" is free on "Mon 10:00" and "Tue 14:00"
    And "Kristine" is free on "Mon 10:00" and "Tue 14:00"
    And "Antonio" is free on "Tue 14:00" and "Wed 09:00"
    When StudyHub looks for a common meeting time
    Then the suggested times are "Tue 14:00"
    And all 3 members are free at the suggested times

  Scenario: No time works for everyone
    Given "Ergens" is free on "Mon 10:00" and "Tue 14:00"
    And "Kristine" is free on "Mon 10:00" and "Wed 09:00"
    And "Antonio" is free on "Thu 16:00" and "Fri 12:00"
    When StudyHub looks for a common meeting time
    Then the suggested times are "Mon 10:00"
    And StudyHub shows that 2 of 3 members are free

  Scenario: Nobody has entered availability
    When StudyHub looks for a common meeting time
    Then "Kristine" is asked to choose a time freely

  Scenario: The meeting is shown to the whole group
    When she schedules "Sprint planning" at "Tue 14:00" in "Room B 2.04"
    Then the meeting "Sprint planning" is shown to "Ergens", "Kristine" and "Antonio"
    And nobody has answered the meeting yet

  Scenario Outline: Members accept or decline the meeting
    Given she scheduled "Sprint planning" at "Tue 14:00" in "Room B 2.04"
    When "<member>" <answer> the meeting
    Then the group sees that "<member>" has <status> the meeting

    Examples:
      | member  | answer   | status   |
      | Ergens  | accepts  | accepted |
      | Antonio | declines | declined |
