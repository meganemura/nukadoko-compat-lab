// Responsibility: check the open editor's contents, whitespace included.

import { expect } from "playwright/test";
import { defineStep, z } from "nukadoko";
import { todoEditor } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the edit box holds {text:string}",
  description: "Check the open editor's contents, exactly, spaces included",
  args: z.object({
    text: z.string().describe("The expected contents, spaces and all"),
  }),
  returns: z.object({
    editorValue: z.string().describe("What the editor actually held"),
  }),
  mutates: false,
  rationale:
    "Compares exactly rather than trimmed, because one scenario's whole claim is that the editor keeps the spaces the app strips on save.",
  async run({ page }, args) {
    const editor = todoEditor(page);
    await expect(editor).toHaveValue(args.text);
    return { editorValue: await editor.inputValue() };
  },
});
