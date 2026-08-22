// Responsibility: put the browser on the TodoMVC page, so every later step
// in the scenario has a page to act on.

import { defineStep, z } from "nukadoko";
import { openTodoApp, readTodoTitles } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the TodoMVC app is open",
  description: "Navigate to the TodoMVC app and wait for its new-todo field",
  args: z.object({}),
  returns: z.object({
    url: z.string().describe("The URL the browser ended up on"),
    titles: z
      .array(z.string())
      .describe("The todo titles already on the page when it opened"),
  }),
  rationale:
    "The URL comes from the fixture bag's baseURL rather than from a literal here, so the environment decides which deployment a run lands on. It refuses rather than falling back to a default, because a silent fallback would let a run report against a target nobody chose.",
  async run({ page, baseURL }) {
    if (!baseURL) {
      throw new Error(
        "No baseURL is configured. Set baseURL in nukadoko.config.ts to the TodoMVC app's own URL.",
      );
    }
    await openTodoApp(page, baseURL);
    return { url: page.url(), titles: await readTodoTitles(page) };
  },
});
