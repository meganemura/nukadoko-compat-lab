// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

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
  test('should trim whitespace when editing', async ({ page }) => {
    // 1. Add a todo 'Original task'
    await addTodo(page, 'Original task');

    // Expect: The todo appears in the list
    await expect(page.getByText('Original task')).toBeVisible();

    // 2. Double-click to edit and change text to '   Edited task   ' (with spaces)
    await startEditingTodo(page, 'Original task');
    await typeInTodoEditor(page, '   Edited task   ');

    // Expect: Edit textbox shows the text with spaces
    await expect(todoEditor(page)).toHaveValue('   Edited task   ');

    // 3. Press Enter to save
    await submitTodoEditor(page);

    // Expect: The todo is saved as 'Edited task' without leading or trailing whitespace
    await expect(page.getByText('Edited task')).toBeVisible();
  });
});
