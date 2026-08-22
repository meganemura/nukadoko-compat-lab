// Responsibility: everything this repository knows about how to reach the
// TodoMVC page: the locators, and the actions built out of them.
//
// Boundaries: this file asserts nothing and imports no test runner. Two
// runners call it (Playwright Test under tests/, nukadoko steps under
// features/steps/), and each one brings its own `expect`. Keeping the
// assertions on the callers is what lets both import this file without
// either one loading the other's runner: the only value import here is
// Playwright's own, and `Page`/`Locator` come in as types, which erase at
// run time.
//
// The locator exports exist for the same reason as the actions. A caller
// that wants to wait for something needs the locator, not a value read
// once, because only a locator can be handed to a retrying assertion.

import type { Locator, Page } from "@playwright/test";

/** Where the app under test lives. The Playwright suite reads it from
 * here; the nukadoko side takes the same value from `baseURL` in
 * nukadoko.config.ts, because nukadoko never reads playwright.config.ts.
 * Two homes, one value, and nothing here can keep them equal. */
export const TODO_APP_URL = "https://demo.playwright.dev/todomvc";

export function newTodoField(page: Page): Locator {
  return page.getByRole("textbox", { name: "What needs to be done?" });
}

export function todoItems(page: Page): Locator {
  return page.getByTestId("todo-item");
}

export function todoItem(page: Page, title: string): Locator {
  return page.getByRole("listitem").filter({ hasText: title });
}

export function todoToggle(page: Page, title: string): Locator {
  return todoItem(page, title).getByLabel("Toggle Todo");
}

export function todoTitles(page: Page): Locator {
  return page.getByTestId("todo-title");
}

export function todoEditor(page: Page): Locator {
  return page.getByRole("textbox", { name: "Edit" });
}

export function todoCounter(page: Page): Locator {
  return page.locator(".todo-count");
}

export function toggleAllCheckbox(page: Page): Locator {
  return page.getByRole("checkbox", { name: "❯Mark all as complete" });
}

export function clearCompletedButton(page: Page): Locator {
  return page.getByRole("button", { name: "Clear completed" });
}

export function deleteButton(page: Page, title: string): Locator {
  return todoItem(page, title).getByRole("button", { name: "Delete" });
}

export function filterLink(page: Page, name: string): Locator {
  return page.getByRole("link", { name });
}

export function appHeading(page: Page): Locator {
  return page.getByRole("heading", { name: "todos" });
}

export async function openTodoApp(page: Page, url: string): Promise<void> {
  await page.goto(url);
  await newTodoField(page).waitFor({ state: "visible" });
}

export async function typeNewTodo(page: Page, text: string): Promise<void> {
  await newTodoField(page).fill(text);
}

export async function focusNewTodoField(page: Page): Promise<void> {
  await newTodoField(page).click();
}

export async function submitNewTodo(page: Page): Promise<void> {
  await newTodoField(page).press("Enter");
}

export async function addTodo(page: Page, title: string): Promise<void> {
  await typeNewTodo(page, title);
  await submitNewTodo(page);
}

export async function toggleTodo(page: Page, title: string): Promise<void> {
  await todoToggle(page, title).click();
}

export async function toggleAllTodos(page: Page): Promise<void> {
  await toggleAllCheckbox(page).click();
}

export async function hoverTodo(page: Page, title: string): Promise<void> {
  await todoItem(page, title).hover();
}

export async function deleteTodo(page: Page, title: string): Promise<void> {
  // The destroy button is only in the accessibility tree while the row is
  // hovered, so the hover is part of deleting rather than a separate move a
  // caller could forget.
  await hoverTodo(page, title);
  await deleteButton(page, title).click();
}

export async function clearCompletedTodos(page: Page): Promise<void> {
  await clearCompletedButton(page).click();
}

export async function startEditingTodo(page: Page, title: string): Promise<void> {
  await todoItem(page, title).getByTestId("todo-title").dblclick();
  await todoEditor(page).waitFor({ state: "visible" });
}

export async function typeInTodoEditor(page: Page, text: string): Promise<void> {
  await todoEditor(page).fill(text);
}

export async function submitTodoEditor(page: Page): Promise<void> {
  await todoEditor(page).press("Enter");
}

export async function cancelTodoEditor(page: Page): Promise<void> {
  await todoEditor(page).press("Escape");
}

export async function blurTodoEditor(page: Page): Promise<void> {
  await appHeading(page).click();
}

export async function selectFilter(page: Page, name: string): Promise<void> {
  await filterLink(page, name).click();
}

/** The titles the list is showing right now, in list order. A read, not a
 * wait: callers that need to wait assert on a locator instead. */
export async function readTodoTitles(page: Page): Promise<string[]> {
  return (await todoTitles(page).allInnerTexts()).map((t) => t.trim());
}

/** The counter's own text ("1 item left"), or null while the footer is
 * absent, which is how an empty list reads. Returning null rather than ""
 * keeps "no footer" apart from "footer with empty text". */
export async function readCounterText(page: Page): Promise<string | null> {
  const counter = todoCounter(page);
  if ((await counter.count()) === 0) return null;
  return (await counter.innerText()).trim();
}

export async function readCompletedTitles(page: Page): Promise<string[]> {
  const titles = await readTodoTitles(page);
  const completed: string[] = [];
  for (const title of titles) {
    if (await todoToggle(page, title).isChecked()) completed.push(title);
  }
  return completed;
}
