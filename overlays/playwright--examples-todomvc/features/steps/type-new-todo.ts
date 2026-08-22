// Responsibility: put text into the new-todo field without submitting it.
// Separate from add-todo because several scenarios read the field back
// between typing and pressing Enter.

import { defineStep, z } from "nukadoko";
import { newTodoField, typeNewTodo } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "{text:string} is typed into the new-todo field",
  description: "Type text into the new-todo field, without submitting it",
  args: z.object({
    text: z.string().describe("The text to put into the new-todo field"),
  }),
  returns: z.object({
    fieldValue: z
      .string()
      .describe("What the new-todo field holds after the typing"),
  }),
  rationale:
    "Reads the field back instead of returning the text it was handed. The two differ whenever the app rejects or rewrites input, and only the read one is worth having on a record.",
  async run({ page }, args) {
    await typeNewTodo(page, args.text);
    return { fieldValue: await newTodoField(page).inputValue() };
  },
});
