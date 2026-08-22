// Responsibility: check that the list holds nothing at all.

import { expect } from "playwright/test";
import { defineStep, z } from "nukadoko";
import { newTodoField, todoItems } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the todo list is empty",
  description: "Check that the list holds no todo at all",
  args: z.object({}),
  returns: z.object({
    itemCount: z.number().describe("How many todo rows the list held"),
    fieldPresent: z
      .boolean()
      .describe(
        "Whether the new-todo field was on screen, which is what says the page was rendered at all rather than blank",
      ),
  }),
  mutates: false,
  rationale:
    "Returns the new-todo field's presence beside the count because a count of zero on a page that never loaded reads exactly like a count of zero on a page that loaded empty.",
  async run({ page }) {
    await expect(todoItems(page)).toHaveCount(0);
    return {
      itemCount: await todoItems(page).count(),
      fieldPresent: await newTodoField(page).isVisible(),
    };
  },
});
