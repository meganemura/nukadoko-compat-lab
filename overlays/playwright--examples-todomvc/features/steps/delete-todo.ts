// Responsibility: remove one todo through its row's Delete button.

import { defineStep, z } from "nukadoko";
import hoverTodoStep from "./hover-todo.js";
import {
  deleteButton,
  readCounterText,
  readTodoTitles,
} from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the todo {title:string} is deleted",
  description: "Delete one todo through the Delete button on its own row",
  args: z.object({
    title: z.string().describe("The title of the todo to delete"),
  }),
  returns: z.object({
    titles: z.array(z.string()).describe("Every todo title left in the list"),
    counter: z
      .string()
      .nullable()
      .describe("The counter's text, or null once the list has no footer"),
  }),
  parts: [hoverTodoStep],
  rationale:
    "The hover is a part rather than inline code because one scenario names the hover as its own line: it checks that hovering is what reveals the Delete button. Sharing it as a part keeps both granularities without either scenario being written for the other.",
  async run({ page, call }, args) {
    await call(hoverTodoStep, { title: args.title });
    await deleteButton(page, args.title).click();
    return {
      titles: await readTodoTitles(page),
      counter: await readCounterText(page),
    };
  },
});
