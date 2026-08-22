// Responsibility: check that one todo's checkbox is not ticked.

import { expect } from "playwright/test";
import { defineStep, z } from "nukadoko";
import { readCompletedTitles, todoToggle } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the todo {title:string} is not marked complete",
  description: "Check that this todo's checkbox is clear",
  args: z.object({
    title: z.string().describe("The title of the todo to look at"),
  }),
  returns: z.object({
    completed: z
      .array(z.string())
      .describe("Every title whose checkbox was ticked when this check ran"),
  }),
  mutates: false,
  rationale:
    "Kept apart from the completed check rather than folded into one step with a flag, because the two are different claims to whoever reads the scenario line.",
  async run({ page }, args) {
    await expect(todoToggle(page, args.title)).not.toBeChecked();
    return { completed: await readCompletedTitles(page) };
  },
});
