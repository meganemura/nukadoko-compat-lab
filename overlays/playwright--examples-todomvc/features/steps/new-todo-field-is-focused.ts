// Responsibility: check that the keyboard is pointed at the new-todo field.

import { expect } from "playwright/test";
import { defineStep, z } from "nukadoko";
import { newTodoField } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the new-todo field is focused",
  description: "Check that the new-todo field has the keyboard focus",
  args: z.object({}),
  returns: z.object({
    focused: z.boolean().describe("Whether the field held focus"),
    fieldValue: z
      .string()
      .describe("What it held at the time, so an empty submit can be told apart from a typed one"),
  }),
  mutates: false,
  async run({ page }) {
    const field = newTodoField(page);
    await expect(field).toBeFocused();
    return { focused: true, fieldValue: await field.inputValue() };
  },
});
