// Responsibility: check that one title is not on the page, and record what
// was there instead.

import { expect } from "playwright/test";
import { defineStep, z } from "nukadoko";
import { readTodoTitles } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the todo list does not show {title:string}",
  description: "Check that no visible todo carries this title",
  args: z.object({
    title: z.string().describe("The title the list is expected not to show"),
  }),
  returns: z.object({
    titles: z
      .array(z.string())
      .describe("Every todo title the list held when this check ran"),
  }),
  mutates: false,
  rationale:
    "An absence on its own cannot tell a later reader whether the item really went or the page was not ready to answer. Returning the titles that were present is that proof.",
  async run({ page }, args) {
    await expect(page.getByText(args.title)).not.toBeVisible();
    return { titles: await readTodoTitles(page) };
  },
});
