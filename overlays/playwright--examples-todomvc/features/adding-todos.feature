Feature: Adding Todos

  Where these came from: the Playwright Test files under tests/adding-todos/,
  one scenario per test(), keeping each test's own name. No ticket exists
  behind them, so what they claim here is what those tests already claimed,
  and nothing has been added.

  Every scenario starts on a freshly opened app, which is what the Playwright
  suite's own page fixture did before each test.

  Background:
    Given the TodoMVC app is open

  Scenario: should add single todo
    Then the new-todo field is visible
    When "Buy groceries" is typed into the new-todo field
    Then the new-todo field holds "Buy groceries"
    When Enter is pressed in the new-todo field
    Then the todo list shows "Buy groceries"
    And the new-todo field holds ""
    And the counter reads "1 item left"

  Scenario: should add multiple todos
    When the todo "Buy milk" is added
    Then the todo list shows "Buy milk"
    And the counter reads "1 item left"
    When the todo "Walk the dog" is added
    Then the todo list shows "Buy milk"
    And the todo list shows "Walk the dog"
    And the counter reads "2 items left"
    When the todo "Finish report" is added
    Then the todo list shows "Buy milk"
    And the todo list shows "Walk the dog"
    And the todo list shows "Finish report"
    And the counter reads "3 items left"

  Scenario: should not add empty todo
    When the new-todo field is clicked
    Then the new-todo field is focused
    When Enter is pressed in the new-todo field
    Then the todo list is empty

  Scenario: should trim whitespace from new todo
    When the todo "   Todo with spaces   " is added
    Then the todo list shows "Todo with spaces"
    And the counter reads "1 item left"
