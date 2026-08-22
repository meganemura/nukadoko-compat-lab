// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

// spec: specs/editing-todos.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';
import {
  addTodo,
  cancelTodoEditor,
  startEditingTodo,
  todoEditor,
  typeInTodoEditor,
} from '../lib/todo';

test.describe('Editing Todos', () => {
  test('should-cancel-edit-on-escape', async ({ page }) => {
    // 1. Add a todo 'Original text'
    await addTodo(page, 'Original text');

    // Expect: The todo appears in the list
    await expect(page.getByText('Original text')).toBeVisible();

    // 2. Double-click on the todo to enter edit mode
    await startEditingTodo(page, 'Original text');

    // Expect: Edit textbox appears with 'Original text'
    await expect(todoEditor(page)).toHaveValue('Original text');

    // 3. Change the text to 'Modified text' but press Escape instead of Enter
    await typeInTodoEditor(page, 'Modified text');
    await cancelTodoEditor(page);

    // Expect: Edit mode is cancelled, The todo text reverts to 'Original text', Changes are not saved
    await expect(page.getByText('Original text')).toBeVisible();
  });
});
