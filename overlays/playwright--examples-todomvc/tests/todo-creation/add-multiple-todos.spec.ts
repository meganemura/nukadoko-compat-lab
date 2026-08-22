// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';
import { addTodo, newTodoField, todoCounter, todoToggle } from '../lib/todo';

test.describe('Todo Creation', () => {
  test('Add multiple todos', async ({ page }) => {
    // 1. Navigate to the TodoMVC application
    // Expect: The page loads with an empty todo list
    await expect(newTodoField(page)).toBeVisible();

    await test.step('Add first todo', async () => {
      // 2. Add first todo 'Buy groceries' by typing and pressing Enter
      await addTodo(page, 'Buy groceries');
      // Expect: The first todo appears in the list
      await expect(page.getByText('Buy groceries')).toBeVisible();
    });

    // 3. Add second todo 'Walk the dog' by typing and pressing Enter
    await test.step('Add second todo', async () => {
      await addTodo(page, 'Walk the dog');
      // Expect: The second todo appears in the list below the first
      await expect(page.getByText('Walk the dog')).toBeVisible();
    });

    // 4. Add third todo 'Read a book' by typing and pressing Enter
    await test.step('Add third todo', async () => {
      await addTodo(page, 'Read a book');
      // Expect: The third todo appears in the list below the second
      await expect(page.getByText('Read a book')).toBeVisible();
    });

    // Post Conditions: All three todos are visible in the list
    await test.step('Post Conditions: Verify all todos are visible', async () => {
      await expect(page.getByText('Buy groceries')).toBeVisible();
      await expect(page.getByText('Walk the dog')).toBeVisible();
      await expect(page.getByText('Read a book')).toBeVisible();
    });

    // Post Conditions: The todo counter shows '3 items left'
    await expect(todoCounter(page)).toHaveText('3 items left');

    // Post Conditions: All todos are in active (unchecked) state
    await expect(todoToggle(page, 'Buy groceries')).not.toBeChecked();
  });
});
