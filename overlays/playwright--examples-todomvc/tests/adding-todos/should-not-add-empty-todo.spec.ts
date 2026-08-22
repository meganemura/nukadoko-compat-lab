// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

// spec: Adding Todos - should not add empty todo
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';
import {
  focusNewTodoField,
  newTodoField,
  submitNewTodo,
  todoItems,
} from '../lib/todo';

test.describe('Adding Todos', () => {
  test('should not add empty todo', async ({ page }) => {
    // 1. Click on the input field without typing anything
    await focusNewTodoField(page);

    // Expect: The input field is focused
    await expect(newTodoField(page)).toBeFocused();

    // 2. Press Enter
    await submitNewTodo(page);

    // Expect: No todo is added to the list, The todo list remains empty
    await expect(todoItems(page)).toHaveCount(0);
  });
});
