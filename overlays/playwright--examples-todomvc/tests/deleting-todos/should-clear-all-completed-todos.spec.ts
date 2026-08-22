// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

// spec: specs/basic-operations.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';
import {
  addTodo,
  clearCompletedButton,
  clearCompletedTodos,
  todoCounter,
  toggleTodo,
} from '../lib/todo';

test.describe('Deleting Todos', () => {
  test('should-clear-all-completed-todos', async ({ page }) => {
    // 1. Add three todos: 'Task 1', 'Task 2', 'Task 3'
    await addTodo(page, 'Task 1');
    await addTodo(page, 'Task 2');
    await addTodo(page, 'Task 3');
    await expect(page.locator('body')).toMatchAriaSnapshot(`
- list:
  - listitem: "Task 1"
  - listitem: "Task 2"
  - listitem: "Task 3"
`);

    // 2. Mark 'Task 1' and 'Task 3' as complete
    await toggleTodo(page, 'Task 1');
    await toggleTodo(page, 'Task 3');
    await expect(todoCounter(page)).toHaveText('1 item left');
    await expect(clearCompletedButton(page)).toBeVisible();

    // 3. Click the 'Clear completed' button
    await clearCompletedTodos(page);
    await expect(page.getByText('Task 2')).toBeVisible();
    await expect(todoCounter(page)).toHaveText('1 item left');
  });
});
