// Responsibility: check that the app rendered far enough to take a todo.

import { expect } from "playwright/test";
import { defineStep, z } from "nukadoko";
import { newTodoField } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the new-todo field is visible",
  description: "Check that the new-todo field is on screen",
  args: z.object({}),
  returns: z.object({
    placeholder: z
      .string()
      .describe("The field's own placeholder text, which is also its label"),
  }),
  mutates: false,
  async run({ page }) {
    const field = newTodoField(page);
    await expect(field).toBeVisible();
    return { placeholder: (await field.getAttribute("placeholder")) ?? "" };
  },
});
