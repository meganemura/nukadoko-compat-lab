// Responsibility: check what the new-todo field currently holds, including
// the empty case that says it was cleared.

import { expect } from "playwright/test";
import { defineStep, z } from "nukadoko";
import { newTodoField } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the new-todo field holds {text:string}",
  description: "Check the new-todo field's contents; an empty string means cleared",
  args: z.object({
    text: z
      .string()
      .describe("The expected contents; \"\" is how a cleared field is written"),
  }),
  returns: z.object({
    fieldValue: z.string().describe("What the field actually held"),
  }),
  mutates: false,
  rationale:
    "One step covers cleared and filled, because the empty string is a value the field can hold rather than a separate condition, and a second step would have said the same thing twice.",
  async run({ page }, args) {
    const field = newTodoField(page);
    await expect(field).toHaveValue(args.text);
    return { fieldValue: await field.inputValue() };
  },
});
