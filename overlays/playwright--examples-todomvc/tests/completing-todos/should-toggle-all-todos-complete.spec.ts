// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

// spec: specs/basic-operations.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';
import {
  addTodo,
  clearCompletedButton,
  todoCounter,
  toggleAllTodos,
} from '../lib/todo';

test.describe('Completing Todos', () => {
  test('should-toggle-all-todos-complete', async ({ page }) => {
    // 1. Add three todos: 'Task 1', 'Task 2', 'Task 3'
    await addTodo(page, 'Task 1');
    await addTodo(page, 'Task 2');
    await addTodo(page, 'Task 3');

    // Expect: All three todos are visible and active, Counter shows '3 items left'
    await expect(page.getByText('Task 1')).toBeVisible();
    await expect(page.getByText('Task 2')).toBeVisible();
    await expect(page.getByText('Task 3')).toBeVisible();
    await expect(todoCounter(page)).toHaveText('3 items left');

    // 2. Click the 'Mark all as complete' checkbox
    await toggleAllTodos(page);

    // Expect: All three todos are marked as complete, All checkboxes are checked, Counter shows '0 items left', The 'Clear completed' button appears
    await expect(todoCounter(page)).toHaveText('0 items left');
    await expect(clearCompletedButton(page)).toBeVisible();
  });
});
