// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

// spec: Todo Creation - Prevent adding whitespace-only todo
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';
import { addTodo, newTodoField, todoItems } from '../lib/todo';

test.describe('Todo Creation', () => {
  test('Prevent adding whitespace-only todo', async ({ page }) => {
    // 1. Navigate to the TodoMVC application
    // Expect: The page loads with an empty todo list
    await expect(newTodoField(page)).toBeVisible();

    // 2. Type only spaces '   ' into the input field and press Enter
    // Expect: No todo is added to the list
    await addTodo(page, '   ');

    // Verify no todo was added (todo list remains empty)
    await expect(todoItems(page)).toHaveCount(0);
  });
});
