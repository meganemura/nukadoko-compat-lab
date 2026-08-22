// Responsibility: submit whatever the new-todo field currently holds.

import { defineStep, z } from "nukadoko";
import {
  newTodoField,
  readCounterText,
  readTodoTitles,
  submitNewTodo,
} from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "Enter is pressed in the new-todo field",
  description: "Submit the new-todo field's current contents",
  args: z.object({}),
  returns: z.object({
    fieldValue: z
      .string()
      .describe("What the new-todo field holds after the submit"),
    titles: z.array(z.string()).describe("Every todo title now in the list"),
    counter: z
      .string()
      .nullable()
      .describe("The counter's text, or null while the list has no footer"),
  }),
  rationale:
    "Returns the whole list rather than a verdict on whether one item arrived, because the scenarios using this step split both ways: some expect an item, others expect the list to stay empty.",
  async run({ page }) {
    await submitNewTodo(page);
    return {
      fieldValue: await newTodoField(page).inputValue(),
      titles: await readTodoTitles(page),
      counter: await readCounterText(page),
    };
  },
});
