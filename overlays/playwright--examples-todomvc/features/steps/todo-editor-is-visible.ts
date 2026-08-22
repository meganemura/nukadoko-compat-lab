// Responsibility: check that a todo's inline editor is open.

import { expect } from "playwright/test";
import { defineStep, z } from "nukadoko";
import { todoEditor } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the edit box is visible",
  description: "Check that a todo's inline editor is open",
  args: z.object({}),
  returns: z.object({
    editorValue: z.string().describe("What the open editor held"),
  }),
  mutates: false,
  async run({ page }) {
    const editor = todoEditor(page);
    await expect(editor).toBeVisible();
    return { editorValue: await editor.inputValue() };
  },
});
