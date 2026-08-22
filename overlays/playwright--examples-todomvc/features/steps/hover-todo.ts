// Responsibility: put the pointer on one todo row, which is what brings
// that row's Delete button into the accessibility tree.
//
// This is both a part of delete-todo and a line a scenario can write on its
// own, because one scenario checks that hovering is what reveals the button.

import { defineStep, z } from "nukadoko";
import { deleteButton, hoverTodo } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the todo {title:string} is hovered",
  description: "Move the pointer onto one todo row",
  args: z.object({
    title: z.string().describe("The title of the row to hover"),
  }),
  returns: z.object({
    deleteOffered: z
      .boolean()
      .describe("Whether that row's Delete button is reachable after the hover"),
  }),
  mutates: false,
  rationale:
    "Returns whether the Delete button became reachable, not just that a hover happened. A hover that revealed nothing and a hover that was never delivered look identical otherwise.",
  async run({ page }, args) {
    await hoverTodo(page, args.title);
    return { deleteOffered: await deleteButton(page, args.title).isVisible() };
  },
});
