// Responsibility: abandon the open editor with Escape.

import { defineStep, z } from "nukadoko";
import { cancelTodoEditor, readTodoTitles } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "Escape is pressed in the edit box",
  description: "Abandon the open editor with Escape, keeping the old title",
  args: z.object({}),
  returns: z.object({
    titles: z.array(z.string()).describe("Every todo title now in the list"),
  }),
  async run({ page }) {
    await cancelTodoEditor(page);
    return { titles: await readTodoTitles(page) };
  },
});
