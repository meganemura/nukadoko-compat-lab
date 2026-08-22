// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

// spec: Todo Creation - Prevent adding empty todo
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';
import {
  focusNewTodoField,
  newTodoField,
  submitNewTodo,
  todoItems,
} from '../lib/todo';

test.describe('Todo Creation', () => {
  test('Prevent adding empty todo', async ({ page }) => {
    // Step 1: Navigate to the TodoMVC application
    // Expect: The page loads with an empty todo list
    await expect(newTodoField(page)).toBeVisible();

    // Step 2: Click into the input field without typing anything and press Enter
    // Expect: No todo is added to the list
    await focusNewTodoField(page);
    await submitNewTodo(page);

    // Post Conditions: The todo list remains empty
    await expect(todoItems(page)).toHaveCount(0);

    // Post Conditions: The input field is still focused and empty
    await expect(newTodoField(page)).toHaveValue('');
  });
});
