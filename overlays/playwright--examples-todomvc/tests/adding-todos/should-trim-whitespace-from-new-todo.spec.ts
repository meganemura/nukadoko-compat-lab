// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

// spec: Adding Todos
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';
import { addTodo, todoCounter } from '../lib/todo';

test.describe('Adding Todos', () => {
  test('should trim whitespace from new todo', async ({ page }) => {
    // 1. Type '   Todo with spaces   ' (with leading and trailing spaces) and press Enter
    await addTodo(page, '   Todo with spaces   ');

    // Expect: The todo is added as 'Todo with spaces' without leading or trailing whitespace, Counter shows '1 item left'
    await expect(page.getByText('Todo with spaces')).toBeVisible();
    await expect(todoCounter(page)).toHaveText('1 item left');
  });
});
