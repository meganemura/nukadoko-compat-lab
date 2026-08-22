// Responsibility: follow one of the footer's filter links.

import { defineStep, z } from "nukadoko";
import { readTodoTitles, selectFilter } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the {filter:string} filter is selected",
  description: "Follow one of the footer filter links (All, Active, Completed)",
  args: z.object({
    filter: z.string().describe("The filter link's own label"),
  }),
  returns: z.object({
    url: z.string().describe("The URL the browser is on after following the link"),
    titles: z
      .array(z.string())
      .describe("The todo titles the filtered list is showing"),
  }),
  async run({ page }, args) {
    await selectFilter(page, args.filter);
    return { url: page.url(), titles: await readTodoTitles(page) };
  },
});
