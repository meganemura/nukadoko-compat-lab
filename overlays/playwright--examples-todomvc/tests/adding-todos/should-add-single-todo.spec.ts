// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';
import {
  newTodoField,
  submitNewTodo,
  todoCounter,
  typeNewTodo,
} from '../lib/todo';

test.describe('Adding Todos', () => {
  test('should add single todo', async ({ page }) => {
    // Step 1: Navigate to the TodoMVC application
    // Expect: The application loads successfully, The input field 'What needs to be done?' is visible
    await expect(newTodoField(page)).toBeVisible();

    // Step 2: Type 'Buy groceries' into the input field
    await typeNewTodo(page, 'Buy groceries');
    // Expect: The text appears in the input field
    await expect(newTodoField(page)).toHaveValue('Buy groceries');

    // Step 3: Press Enter to submit the todo
    await submitNewTodo(page);
    // Expect: The new todo 'Buy groceries' appears in the todo list
    await expect(page.getByText('Buy groceries')).toBeVisible();
    // Expect: The input field is cleared
    await expect(newTodoField(page)).toHaveValue('');
    // Expect: The todo counter shows '1 item left'
    await expect(todoCounter(page)).toHaveText('1 item left');
  });
});
