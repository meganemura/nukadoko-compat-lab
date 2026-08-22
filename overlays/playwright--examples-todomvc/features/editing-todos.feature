Feature: Editing Todos

  Where these came from: the Playwright Test files under tests/editing-todos/,
  one scenario per test(), keeping each test's own name.

  Background:
    Given the TodoMVC app is open

  Scenario: should edit todo by double-clicking
    When the todo "Buy milk" is added
    Then the todo list shows "Buy milk"
    When the todo "Buy milk" is opened for editing
    Then the edit box is visible
    And the edit box holds "Buy milk"
    When "Buy organic milk" is typed into the edit box
    And Enter is pressed in the edit box
    Then the todo list shows "Buy organic milk"

  Scenario: should cancel edit on escape
    When the todo "Original text" is added
    Then the todo list shows "Original text"
    When the todo "Original text" is opened for editing
    Then the edit box holds "Original text"
    When "Modified text" is typed into the edit box
    And Escape is pressed in the edit box
    Then the todo list shows "Original text"

  Scenario: should delete todo when edited to empty
    When the todo "Temporary task" is added
    Then the todo list shows "Temporary task"
    And the counter reads "1 item left"
    When the todo "Temporary task" is opened for editing
    Then the edit box is visible
    When "" is typed into the edit box
    And Enter is pressed in the edit box
    Then the todo list does not show "Temporary task"
    And the todo list is empty

  Scenario: should save edit on blur
    When the todo "Call dentist" is added
    And the todo "Call dentist" is opened for editing
    And "Schedule dentist appointment" is typed into the edit box
    And the page heading is clicked
    Then the todo list shows "Schedule dentist appointment"

  Scenario: should trim whitespace when editing
    When the todo "Original task" is added
    Then the todo list shows "Original task"
    When the todo "Original task" is opened for editing
    And "   Edited task   " is typed into the edit box
    Then the edit box holds "   Edited task   "
    When Enter is pressed in the edit box
    Then the todo list shows "Edited task"
