Feature: Completing Todos

  Where these came from: the Playwright Test files under
  tests/completing-todos/, one scenario per test(), keeping each test's own
  name.

  One scenario below, "should uncomplete completed todo", ends with no Then
  line. That is faithful: the test it came from performs both clicks and
  checks nothing afterwards. It is left as it was rather than repaired here,
  because strengthening a claim is a change to what the suite tests and
  belongs to whoever owns that claim.

  Background:
    Given the TodoMVC app is open

  Scenario: should complete single todo
    When the todo "Buy groceries" is added
    Then the todo list shows "Buy groceries"
    And the counter reads "1 item left"
    When the todo "Buy groceries" is completed
    Then the todo "Buy groceries" is marked complete
    And the counter reads "0 items left"
    And the Clear completed button is offered

  Scenario: should complete multiple todos
    When the todo "Buy milk" is added
    And the todo "Walk dog" is added
    And the todo "Finish report" is added
    Then the todo list shows "Buy milk"
    And the todo list shows "Walk dog"
    And the todo list shows "Finish report"
    And the counter reads "3 items left"
    When the todo "Buy milk" is completed
    Then the todo "Buy milk" is marked complete
    And the counter reads "2 items left"
    When the todo "Finish report" is completed
    Then the todo "Finish report" is marked complete
    And the counter reads "1 item left"
    And the Clear completed button is offered

  Scenario: should toggle all todos complete
    When the todo "Task 1" is added
    And the todo "Task 2" is added
    And the todo "Task 3" is added
    Then the todo list shows "Task 1"
    And the todo list shows "Task 2"
    And the todo list shows "Task 3"
    And the counter reads "3 items left"
    When the Mark all as complete checkbox is clicked
    Then the counter reads "0 items left"
    And the Clear completed button is offered

  Scenario: should toggle all todos incomplete
    When the todo "First todo" is added
    And the todo "Second todo" is added
    And the todo "Third todo" is added
    And the Mark all as complete checkbox is clicked
    Then the counter reads "0 items left"
    When the Mark all as complete checkbox is clicked
    Then the counter reads "3 items left"

  Scenario: should uncomplete completed todo
    When the todo "Buy groceries" is added
    And the todo "Buy groceries" is completed
    And the todo "Buy groceries" is reopened
