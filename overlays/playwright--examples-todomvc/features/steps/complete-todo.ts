// Responsibility: tick one todo's own checkbox.

import { defineStep, z } from "nukadoko";
import {
  readCounterText,
  todoToggle,
  toggleTodo,
} from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the todo {title:string} is completed",
  description: "Tick one todo's checkbox so it counts as done",
  args: z.object({
    title: z.string().describe("The title of the todo to complete"),
  }),
  returns: z.object({
    completed: z
      .boolean()
      .describe("Whether that todo's checkbox is ticked afterwards"),
    counter: z
      .string()
      .nullable()
      .describe("The counter's text, or null while the list has no footer"),
  }),
  async run({ page }, args) {
    await toggleTodo(page, args.title);
    return {
      completed: await todoToggle(page, args.title).isChecked(),
      counter: await readCounterText(page),
    };
  },
});
