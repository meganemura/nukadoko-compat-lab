// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

// spec: specs/basic-operations.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';
import {
  addTodo,
  blurTodoEditor,
  startEditingTodo,
  typeInTodoEditor,
} from '../lib/todo';

test.describe('Editing Todos', () => {
  test('should-save-edit-on-blur', async ({ page }) => {
    // 1. Add a todo 'Call dentist'
    await addTodo(page, 'Call dentist');

    // 2. Double-click on the todo to enter edit mode
    await startEditingTodo(page, 'Call dentist');

    // 3. Change the text to 'Schedule dentist appointment' and click elsewhere (blur the input)
    await typeInTodoEditor(page, 'Schedule dentist appointment');
    await blurTodoEditor(page);

    await expect(page.getByText('Schedule dentist appointment')).toBeVisible();
  });
});
