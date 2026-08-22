// Responsibility: commit the open editor with Enter.

import { defineStep, z } from "nukadoko";
import {
  readCounterText,
  readTodoTitles,
  submitTodoEditor,
} from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "Enter is pressed in the edit box",
  description: "Commit the open editor's contents with Enter",
  args: z.object({}),
  returns: z.object({
    titles: z.array(z.string()).describe("Every todo title now in the list"),
    counter: z
      .string()
      .nullable()
      .describe("The counter's text, or null once the list has no footer"),
  }),
  rationale:
    "Returns the whole list because committing an empty editor deletes the todo, so this one gesture can end with an item renamed or with the list one shorter.",
  async run({ page }) {
    await submitTodoEditor(page);
    return {
      titles: await readTodoTitles(page),
      counter: await readCounterText(page),
    };
  },
});
