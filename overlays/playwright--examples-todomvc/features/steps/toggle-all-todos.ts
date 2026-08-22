// Responsibility: click the one checkbox that flips every todo at once.

import { defineStep, z } from "nukadoko";
import {
  readCompletedTitles,
  readCounterText,
  readTodoTitles,
  toggleAllTodos,
} from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the Mark all as complete checkbox is clicked",
  description: "Click the checkbox that completes or reopens every todo at once",
  args: z.object({}),
  returns: z.object({
    titles: z.array(z.string()).describe("Every todo title in the list"),
    completed: z
      .array(z.string())
      .describe("The titles whose checkbox is ticked after the click"),
    counter: z
      .string()
      .nullable()
      .describe("The counter's text, or null while the list has no footer"),
  }),
  rationale:
    "Returns which titles ended up ticked rather than a direction, because this one control both completes and reopens depending on where the list already was, and the record has to say which happened.",
  async run({ page }) {
    await toggleAllTodos(page);
    return {
      titles: await readTodoTitles(page),
      completed: await readCompletedTitles(page),
      counter: await readCounterText(page),
    };
  },
});
