Feature: Todo Creation

  Where these came from: the Playwright Test files under tests/todo-creation/,
  one scenario per test(), keeping each test's own name. They overlap with
  Adding Todos on purpose: both directories existed in the suite that came
  across, and merging them would have thrown away a record of what was there.

  Background:
    Given the TodoMVC app is open

  Scenario: Add a single todo
    Then the new-todo field is visible
    When "Buy groceries" is typed into the new-todo field
    Then the new-todo field holds "Buy groceries"
    When Enter is pressed in the new-todo field
    Then the todo list shows "Buy groceries"
    And the new-todo field holds ""
    And the counter reads "1 item left"
    And the todo "Buy groceries" is not marked complete

  Scenario: Add multiple todos
    Then the new-todo field is visible
    When the todo "Buy groceries" is added
    Then the todo list shows "Buy groceries"
    When the todo "Walk the dog" is added
    Then the todo list shows "Walk the dog"
    When the todo "Read a book" is added
    Then the todo list shows "Read a book"
    And the todo list shows "Buy groceries"
    And the todo list shows "Walk the dog"
    And the counter reads "3 items left"
    And the todo "Buy groceries" is not marked complete

  Scenario: Add todo with special characters
    Then the new-todo field is visible
    When the todo "Buy @groceries & supplies (urgent!)" is added
    Then the todo list shows "Buy @groceries & supplies (urgent!)"
    And the counter reads "1 item left"

  Scenario: Prevent adding empty todo
    Then the new-todo field is visible
    When the new-todo field is clicked
    And Enter is pressed in the new-todo field
    Then the todo list is empty
    And the new-todo field holds ""

  Scenario: Prevent adding whitespace-only todo
    Then the new-todo field is visible
    When the todo "   " is added
    Then the todo list is empty
