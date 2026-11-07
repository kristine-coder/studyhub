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

  Scenario Outline: Login is rejected for wrong credentials
    Given the email address "kristine@example.com" is confirmed
    When the student logs in with "<email>" and "<password>"
    Then the message "Email or password is wrong" is shown
    And the student stays on the login page

    Examples:
      | email                | password    | case           |
      | kristine@example.com | WrongPass   | wrong password |
      | nobody@example.com   | Secret123   | unknown email  |

  Scenario: Login is rejected when the email address is not confirmed
    When the student logs in with "kristine@example.com" and "Secret123"
    Then the message "Please confirm your email address first." is shown
    And the student is offered to resend the confirmation email

  Scenario: The confirmation email is sent again on request
    When the student logs in with "kristine@example.com" and "Secret123"
    And the student asks to resend the confirmation email
    Then a "confirmation" email is sent to "kristine@example.com"

  Scenario: Login is blocked after five wrong attempts
    Given the email address "kristine@example.com" is confirmed
    When the student enters a wrong password 5 times
    Then the message "Too many attempts. Please try again in 10 minutes." is shown

  Scenario: A blocked student cannot log in even with the correct password
    Given the email address "kristine@example.com" is confirmed
    And the student entered a wrong password 5 times
    When 9 minutes pass
    And the student logs in with "kristine@example.com" and "Secret123"
    Then the message "Too many attempts. Please try again in 10 minutes." is shown

  Scenario: The block ends after 10 minutes
    Given the email address "kristine@example.com" is confirmed
    And the student entered a wrong password 5 times
    When 10 minutes pass
    And the student logs in with "kristine@example.com" and "Secret123"
    Then the student sees the dashboard

  Scenario: Forgot password
    When the student chooses "Forgot password" for "kristine@example.com"
    Then a "password-reset" email is sent to "kristine@example.com"
