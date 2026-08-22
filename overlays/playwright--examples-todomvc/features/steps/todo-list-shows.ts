// Responsibility: check that one title is on the page, and record every
// title that was there when the check ran.

import { expect } from "playwright/test";
import { defineStep, z } from "nukadoko";
import { readTodoTitles } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the todo list shows {title:string}",
  description: "Check that a todo with this title is visible in the list",
  args: z.object({
    title: z.string().describe("The title the list is expected to show"),
  }),
  returns: z.object({
    titles: z
      .array(z.string())
      .describe("Every todo title the list held when this check ran"),
  }),
  mutates: false,
  rationale:
    "Returns the whole list rather than a boolean for the one title. A record saying only true adds nothing to the step having passed; the list is what makes a neighbouring failure readable.",
  async run({ page }, args) {
    await expect(page.getByText(args.title)).toBeVisible();
    return { titles: await readTodoTitles(page) };
  },
});
