// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';
import { addTodo, todoCounter } from '../lib/todo';

test.describe('Adding Todos', () => {
  test('should add multiple todos', async ({ page }) => {
    // 1. Add first todo 'Buy milk'
    await addTodo(page, 'Buy milk');

    // Expect: The todo appears in the list, Counter shows '1 item left'
    await expect(page.getByText('Buy milk')).toBeVisible();
    await expect(todoCounter(page)).toHaveText('1 item left');

    // 2. Add second todo 'Walk the dog'
    await addTodo(page, 'Walk the dog');

    // Expect: Both todos appear in the list, Counter shows '2 items left'
    await expect(page.getByText('Buy milk')).toBeVisible();
    await expect(page.getByText('Walk the dog')).toBeVisible();
    await expect(todoCounter(page)).toHaveText('2 items left');

    // 3. Add third todo 'Finish report'
    await addTodo(page, 'Finish report');

    // Expect: All three todos appear in the list, Counter shows '3 items left'
    await expect(page.getByText('Buy milk')).toBeVisible();
    await expect(page.getByText('Walk the dog')).toBeVisible();
    await expect(page.getByText('Finish report')).toBeVisible();
    await expect(todoCounter(page)).toHaveText('3 items left');
  });
});
