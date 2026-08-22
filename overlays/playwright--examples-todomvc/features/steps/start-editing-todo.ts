// Responsibility: open one todo's inline editor by double-clicking its title.

import { defineStep, z } from "nukadoko";
import { startEditingTodo, todoEditor } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the todo {title:string} is opened for editing",
  description: "Double-click a todo's title to open its inline editor",
  args: z.object({
    title: z.string().describe("The title of the todo to edit"),
  }),
  returns: z.object({
    editorValue: z
      .string()
      .describe("What the editor holds when it opens, before any typing"),
  }),
  rationale:
    "Returns the editor's opening contents because that is what several scenarios check next, and because an editor that opened empty and one that never opened both look like a failure later on.",
  async run({ page }, args) {
    await startEditingTodo(page, args.title);
    return { editorValue: await todoEditor(page).inputValue() };
  },
});
