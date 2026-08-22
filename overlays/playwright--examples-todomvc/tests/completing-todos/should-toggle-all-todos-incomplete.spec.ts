// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

// spec: specs/basic-operations.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';
import { addTodo, todoCounter, toggleAllTodos } from '../lib/todo';

test.describe('Completing Todos', () => {
  test('should toggle all todos incomplete', async ({ page }) => {
    // 1. Add three todos and mark all as complete using the toggle all checkbox
    await addTodo(page, 'First todo');
    await addTodo(page, 'Second todo');
    await addTodo(page, 'Third todo');
    await toggleAllTodos(page);
    await expect(todoCounter(page)).toHaveText('0 items left');

    // 2. Click the 'Mark all as complete' checkbox again
    await toggleAllTodos(page);
    await expect(todoCounter(page)).toHaveText('3 items left');
  });
});
