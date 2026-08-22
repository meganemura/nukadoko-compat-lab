// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

// spec: specs/editing-todos.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';
import {
  addTodo,
  startEditingTodo,
  submitTodoEditor,
  todoEditor,
  typeInTodoEditor,
} from '../lib/todo';

test.describe('Editing Todos', () => {
  test('should edit todo by double-clicking', async ({ page }) => {
    // 1. Add a todo 'Buy milk'
    await addTodo(page, 'Buy milk');
    await expect(page.getByText('Buy milk')).toBeVisible();

    // 2. Double-click on the todo text
    await startEditingTodo(page, 'Buy milk');
    await expect(todoEditor(page)).toBeVisible();
    await expect(todoEditor(page)).toHaveValue('Buy milk');

    // 3. Change the text to 'Buy organic milk' and press Enter
    await typeInTodoEditor(page, 'Buy organic milk');
    await submitTodoEditor(page);
    await expect(page.getByText('Buy organic milk')).toBeVisible();
  });
});
