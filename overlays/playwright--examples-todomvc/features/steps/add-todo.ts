// Responsibility: the whole add gesture, typing and submitting, for the
// scenarios that never look at the field in between.

import { defineStep, z } from "nukadoko";
import { addTodo, readCounterText, readTodoTitles } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the todo {title:string} is added",
  description: "Type a title into the new-todo field and submit it",
  args: z.object({
    title: z.string().describe("The title to type, exactly as typed"),
  }),
  returns: z.object({
    titles: z
      .array(z.string())
      .describe("Every todo title now in the list, as the page renders them"),
    counter: z
      .string()
      .nullable()
      .describe("The counter's text, or null while the list has no footer"),
  }),
  rationale:
    "Returns what the list renders rather than the title it was given. The app trims what it stores, so the two are not the same string, and the rendered one is what a later reader needs.",
  async run({ page }, args) {
    await addTodo(page, args.title);
    return {
      titles: await readTodoTitles(page),
      counter: await readCounterText(page),
    };
  },
});
