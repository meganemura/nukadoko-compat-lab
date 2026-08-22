// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

// spec: specs/basic-operations.plan.md
// seed: tests/seed.spec.ts

import { test } from '../fixtures';
import { addTodo, toggleTodo } from '../lib/todo';

test.describe('Completing Todos', () => {
  test('should-uncomplete-completed-todo', async ({ page }) => {
    // 1. Add a todo 'Buy groceries' and mark it as complete
    await addTodo(page, 'Buy groceries');
    await toggleTodo(page, 'Buy groceries');

    // 2. Click the checkbox again to uncomplete it
    await toggleTodo(page, 'Buy groceries');
  });
});
