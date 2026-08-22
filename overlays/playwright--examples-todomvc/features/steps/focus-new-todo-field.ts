// Responsibility: click the new-todo field, for the scenarios that submit
// an untouched field.

import { defineStep, z } from "nukadoko";
import { focusNewTodoField, newTodoField } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the new-todo field is clicked",
  description: "Click the new-todo field so it takes the keyboard",
  args: z.object({}),
  returns: z.object({
    fieldValue: z.string().describe("What the field holds after the click"),
  }),
  async run({ page }) {
    await focusNewTodoField(page);
    return { fieldValue: await newTodoField(page).inputValue() };
  },
});
