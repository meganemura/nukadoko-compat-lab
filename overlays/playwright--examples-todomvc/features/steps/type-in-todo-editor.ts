// Responsibility: replace what the open editor holds, without committing it.

import { defineStep, z } from "nukadoko";
import { todoEditor, typeInTodoEditor } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "{text:string} is typed into the edit box",
  description: "Replace the open editor's contents, without committing them",
  args: z.object({
    text: z.string().describe("The text to put into the editor, exactly as typed"),
  }),
  returns: z.object({
    editorValue: z.string().describe("What the editor holds after the typing"),
  }),
  async run({ page }, args) {
    await typeInTodoEditor(page, args.text);
    return { editorValue: await todoEditor(page).inputValue() };
  },
});
