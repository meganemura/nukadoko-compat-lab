Feature: Filtering Todos

  Where this came from: the Playwright Test file under tests/filtering-todos/,
  one scenario per test(), keeping the test's own name.

  Background:
    Given the TodoMVC app is open

  Scenario: should filter active todos
    When the todo "Active 1" is added
    And the todo "Active 2" is added
    And the todo "Will complete" is added
    Then the todo list shows "Active 1"
    And the todo list shows "Active 2"
    And the todo list shows "Will complete"
    When the todo "Will complete" is completed
    Then the todo "Will complete" is marked complete
    And the counter reads "2 items left"
    When the "Active" filter is selected
    Then the URL ends with "#/active"
    And the todo list shows "Active 1"
    And the todo list shows "Active 2"
    And the todo list does not show "Will complete"
    And the "Active" filter link is visible
