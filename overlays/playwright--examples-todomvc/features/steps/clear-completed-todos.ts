// Responsibility: press the footer button that drops every completed todo.

import { defineStep, z } from "nukadoko";
import {
  clearCompletedTodos,
  readCounterText,
  readTodoTitles,
} from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the Clear completed button is clicked",
  description: "Press Clear completed, removing every completed todo",
  args: z.object({}),
  returns: z.object({
    titles: z.array(z.string()).describe("Every todo title left in the list"),
    counter: z
      .string()
      .nullable()
      .describe("The counter's text, or null once the list has no footer"),
  }),
  async run({ page }) {
    await clearCompletedTodos(page);
    return {
      titles: await readTodoTitles(page),
      counter: await readCounterText(page),
    };
  },
});
