// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';
import { addTodo, newTodoField, todoCounter } from '../lib/todo';

test.describe('Todo Creation', () => {
  test('Add todo with special characters', async ({ page }) => {
    // 1. Navigate to the TodoMVC application
    // Expect: The page loads with an empty todo list
    await expect(newTodoField(page)).toBeVisible();

    // 2. Type 'Buy @groceries & supplies (urgent!)' into the input field and press Enter
    await addTodo(page, 'Buy @groceries & supplies (urgent!)');

    // Expect: The todo appears in the list with all special characters preserved
    await expect(page.getByText('Buy @groceries & supplies (urgent!)')).toBeVisible();

    // Post Condition: The todo counter shows '1 item left'
    await expect(todoCounter(page)).toHaveText('1 item left');
  });
});
