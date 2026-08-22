// Responsibility: take focus off the open editor by clicking the page
// heading, which is how one scenario commits an edit without pressing a key.

import { defineStep, z } from "nukadoko";
import { blurTodoEditor, readTodoTitles } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the page heading is clicked",
  description: "Click the page heading, taking focus off the open editor",
  args: z.object({}),
  returns: z.object({
    titles: z.array(z.string()).describe("Every todo title now in the list"),
  }),
  rationale:
    "Named for the click rather than for saving, because the scenario's claim is that losing focus is enough to save. A step called save-edit-on-blur would have asserted the thing the scenario exists to check.",
  async run({ page }) {
    await blurTodoEditor(page);
    return { titles: await readTodoTitles(page) };
  },
});
