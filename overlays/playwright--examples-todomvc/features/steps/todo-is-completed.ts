// Responsibility: check that one todo's checkbox is ticked.

import { expect } from "playwright/test";
import { defineStep, z } from "nukadoko";
import { readCompletedTitles, todoToggle } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the todo {title:string} is marked complete",
  description: "Check that this todo's checkbox is ticked",
  args: z.object({
    title: z.string().describe("The title of the todo to look at"),
  }),
  returns: z.object({
    completed: z
      .array(z.string())
      .describe("Every title whose checkbox was ticked when this check ran"),
  }),
  mutates: false,
  async run({ page }, args) {
    await expect(todoToggle(page, args.title)).toBeChecked();
    return { completed: await readCompletedTitles(page) };
  },
});
