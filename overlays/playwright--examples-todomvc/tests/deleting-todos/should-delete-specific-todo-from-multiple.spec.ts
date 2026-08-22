// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

// spec: specs/basic-operations.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';
import { addTodo, deleteTodo, todoCounter } from '../lib/todo';

test.describe('Deleting Todos', () => {
  test('should-delete-specific-todo-from-multiple', async ({ page }) => {
    // 1. Add three todos: 'Task 1', 'Task 2', 'Task 3'
    await addTodo(page, 'Task 1');
    await addTodo(page, 'Task 2');
    await addTodo(page, 'Task 3');

    // Expect: All three todos appear in the list,Counter shows '3 items left'
    await expect(page.getByText('Task 1')).toBeVisible();
    await expect(page.getByText('Task 2')).toBeVisible();
    await expect(page.getByText('Task 3')).toBeVisible();
    await expect(todoCounter(page)).toHaveText('3 items left');

    // 2. Hover over 'Task 2' and click its delete button
    await deleteTodo(page, 'Task 2');

    // Expect: 'Task 2' is removed from the list,'Task 1' and 'Task 3' remain visible,Counter shows '2 items left'
    await expect(page.getByText('Task 1')).toBeVisible();
    await expect(page.getByText('Task 3')).toBeVisible();
    await expect(todoCounter(page)).toHaveText('2 items left');
  });
});
