// Responsibility: untick one todo's own checkbox.
//
// The click is the same one complete-todo makes; the two are separate steps
// because a scenario's reader is told two different things, and each one's
// own record then carries the state that click actually produced.

import { defineStep, z } from "nukadoko";
import {
  readCounterText,
  todoToggle,
  toggleTodo,
} from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the todo {title:string} is reopened",
  description: "Untick one todo's checkbox so it counts as still to do",
  args: z.object({
    title: z.string().describe("The title of the todo to reopen"),
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
