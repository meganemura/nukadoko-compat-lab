Feature: Deleting Todos

  Where these came from: the Playwright Test files under tests/deleting-todos/,
  one scenario per test(), keeping each test's own name.

  One claim changed shape on the way across. The first scenario's original
  test held the page against a Playwright aria snapshot, and that assertion
  only runs inside the Playwright Test runner. What it asserted here was that
  the list held those three rows in that order, so the scenario says that
  directly instead. The Playwright test still uses the snapshot.

  Background:
    Given the TodoMVC app is open

  Scenario: should clear all completed todos
    When the todo "Task 1" is added
    And the todo "Task 2" is added
    And the todo "Task 3" is added
    Then the todo list reads
      """
      Task 1
      Task 2
      Task 3
      """
    When the todo "Task 1" is completed
    And the todo "Task 3" is completed
    Then the counter reads "1 item left"
    And the Clear completed button is offered
    When the Clear completed button is clicked
    Then the todo list shows "Task 2"
    And the counter reads "1 item left"

  Scenario: should delete single todo
    When the todo "Task to delete" is added
    Then the todo list shows "Task to delete"
    And the counter reads "1 item left"
    When the todo "Task to delete" is hovered
    Then the todo "Task to delete" offers a Delete button
    When the todo "Task to delete" is deleted
    Then the todo list does not show "Task to delete"
    And the todo list is empty

  Scenario: should delete specific todo from multiple
    When the todo "Task 1" is added
    And the todo "Task 2" is added
    And the todo "Task 3" is added
    Then the todo list shows "Task 1"
    And the todo list shows "Task 2"
    And the todo list shows "Task 3"
    And the counter reads "3 items left"
    When the todo "Task 2" is deleted
    Then the todo list shows "Task 1"
    And the todo list shows "Task 3"
    And the counter reads "2 items left"
