// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

// spec: specs/basic-operations.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';
import {
  addTodo,
  clearCompletedButton,
  todoCounter,
  todoToggle,
  toggleTodo,
} from '../lib/todo';

test.describe('Completing Todos', () => {
  test('should-complete-single-todo', async ({ page }) => {
    // 1. Add a todo 'Buy groceries'
    await addTodo(page, 'Buy groceries');

    // Expect: The todo appears as active, Counter shows '1 item left'
    await expect(page.getByText('Buy groceries')).toBeVisible();
    await expect(todoCounter(page)).toHaveText('1 item left');

    // 2. Click the checkbox next to the todo
    await toggleTodo(page, 'Buy groceries');

    // Expect: The checkbox is checked, Counter shows '0 items left', The 'Clear completed' button appears in the footer
    await expect(todoToggle(page, 'Buy groceries')).toBeChecked();
    await expect(todoCounter(page)).toHaveText('0 items left');
    await expect(clearCompletedButton(page)).toBeVisible();
  });
});
