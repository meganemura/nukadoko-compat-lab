// Modified from microsoft/playwright's examples/todomvc (commit d4e1023,
// Apache-2.0): locator and action calls now go through tests/lib/todo.ts.

/* eslint-disable notice/notice */

import { test as baseTest } from '@playwright/test';
import { openTodoApp, TODO_APP_URL } from './lib/todo';

export { expect } from '@playwright/test';

export const test = baseTest.extend({
  page: async ({ page }, use) => {
    await openTodoApp(page, TODO_APP_URL);
    await use(page);
  },
});
