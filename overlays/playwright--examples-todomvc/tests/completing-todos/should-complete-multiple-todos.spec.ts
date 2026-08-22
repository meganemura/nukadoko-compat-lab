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
  test('should complete multiple todos', async ({ page }) => {
    // 1. Add three todos: 'Buy milk', 'Walk dog', 'Finish report'
    await addTodo(page, 'Buy milk');
    await addTodo(page, 'Walk dog');
    await addTodo(page, 'Finish report');

    // Expect: All three todos are visible, Counter shows '3 items left'
    await expect(page.getByText('Buy milk')).toBeVisible();
    await expect(page.getByText('Walk dog')).toBeVisible();
    await expect(page.getByText('Finish report')).toBeVisible();
    await expect(todoCounter(page)).toHaveText('3 items left');

    // 2. Complete the first todo
    await toggleTodo(page, 'Buy milk');

    // Expect: First todo is marked as complete, Counter shows '2 items left'
    await expect(todoToggle(page, 'Buy milk')).toBeChecked();
    await expect(todoCounter(page)).toHaveText('2 items left');

    // 3. Complete the third todo
    await toggleTodo(page, 'Finish report');

    // Expect: Third todo is marked as complete, Counter shows '1 item left', The 'Clear completed' button appears
    await expect(todoToggle(page, 'Finish report')).toBeChecked();
    await expect(todoCounter(page)).toHaveText('1 item left');
    await expect(clearCompletedButton(page)).toBeVisible();
  });
});
