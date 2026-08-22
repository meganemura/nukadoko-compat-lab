// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

// spec: Editing Todos - should delete todo when edited to empty
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';
import {
  addTodo,
  startEditingTodo,
  submitTodoEditor,
  todoCounter,
  todoEditor,
  todoTitles,
  typeInTodoEditor,
} from '../lib/todo';

test.describe('Editing Todos', () => {
  test('should delete todo when edited to empty', async ({ page }) => {
    // 1. Add a todo 'Temporary task'
    await addTodo(page, 'Temporary task');
    await expect(page.getByText('Temporary task')).toBeVisible();
    await expect(todoCounter(page)).toHaveText('1 item left');

    // 2. Double-click on the todo to enter edit mode
    await startEditingTodo(page, 'Temporary task');
    await expect(todoEditor(page)).toBeVisible();

    // 3. Clear all the text and press Enter
    await typeInTodoEditor(page, '');
    await submitTodoEditor(page);
    await expect(page.getByText('Temporary task')).not.toBeVisible();
    await expect(todoTitles(page)).toHaveCount(0);
  });
});
