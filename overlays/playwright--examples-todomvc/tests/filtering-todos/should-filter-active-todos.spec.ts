// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

// spec: Filtering Todos
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';
import {
  addTodo,
  filterLink,
  selectFilter,
  todoCounter,
  todoToggle,
  toggleTodo,
} from '../lib/todo';

test.describe('Filtering Todos', () => {
  test('should-filter-active-todos', async ({ page }) => {
    // 1. Add three todos: 'Active 1', 'Active 2', 'Will complete'
    await addTodo(page, 'Active 1');
    await addTodo(page, 'Active 2');
    await addTodo(page, 'Will complete');

    // Expect: All three todos are visible
    await expect(page.getByText('Active 1')).toBeVisible();
    await expect(page.getByText('Active 2')).toBeVisible();
    await expect(page.getByText('Will complete')).toBeVisible();

    // 2. Mark 'Will complete' as completed
    await toggleTodo(page, 'Will complete');

    // Expect: One todo is marked as complete, Counter shows '2 items left'
    await expect(todoToggle(page, 'Will complete')).toBeChecked();
    await expect(todoCounter(page)).toHaveText('2 items left');

    // 3. Click on the 'Active' filter link
    await selectFilter(page, 'Active');

    // Expect: The URL changes to #/active
    await expect(page).toHaveURL(/#\/active$/);

    // Expect: Only 'Active 1' and 'Active 2' are displayed
    await expect(page.getByText('Active 1')).toBeVisible();
    await expect(page.getByText('Active 2')).toBeVisible();

    // Expect: 'Will complete' is not visible
    await expect(page.getByText('Will complete')).not.toBeVisible();

    // Expect: The 'Active' filter link is highlighted
    await expect(filterLink(page, 'Active')).toBeVisible();
  });
});
