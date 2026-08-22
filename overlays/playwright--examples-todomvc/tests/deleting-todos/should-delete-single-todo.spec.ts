// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

// spec: specs/basic-operations.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';
import {
  addTodo,
  deleteButton,
  deleteTodo,
  hoverTodo,
  todoCounter,
  todoItems,
} from '../lib/todo';

test.describe('Deleting Todos', () => {
  test('should-delete-single-todo', async ({ page }) => {
    // 1. Add a todo 'Task to delete'
    await addTodo(page, 'Task to delete');
    await expect(page.getByText('Task to delete')).toBeVisible();
    await expect(todoCounter(page)).toHaveText('1 item left');

    // 2. Hover over the todo item
    await hoverTodo(page, 'Task to delete');
    await expect(deleteButton(page, 'Task to delete')).toBeVisible();

    // 3. Click the delete button
    await deleteTodo(page, 'Task to delete');
    await expect(page.getByText('Task to delete')).not.toBeVisible();
    await expect(todoItems(page)).toHaveCount(0);
  });
});
