// Responsibility: hold the whole list against an expected list, order
// included, which is the one claim in the original suite about structure
// rather than about a single value.
//
// The test this came from used Playwright's toMatchAriaSnapshot. That
// assertion needs the Playwright Test runner's own per-test state and
// throws "toMatchAriaSnapshot() must be called during the test" anywhere
// else, so it cannot run inside a step. What the snapshot asserted here was
// membership and order of the three rows, and that is what this step
// checks instead.

import { expect } from "playwright/test";
import { defineStep, z } from "nukadoko";
import { readTodoTitles, todoItems } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the todo list reads",
  description:
    "Check the whole list against expected titles, one per line below the step, in list order",
  args: z.object({
    expected: z
      .string()
      .describe("The expected titles, one per line, written as a docstring under the line"),
  }),
  returns: z.object({
    titles: z
      .array(z.string())
      .describe("The titles the list held, in the order it rendered them"),
  }),
  mutates: false,
  rationale:
    "Takes a docstring rather than one title per line of the scenario, because the claim is about the list as a whole: three separate lines would each pass while the list held them in the wrong order.",
  async run({ page }, args) {
    const expected = args.expected
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    await expect(todoItems(page)).toHaveCount(expected.length);
    const titles = await readTodoTitles(page);
    expect(titles, "todo titles, in list order").toEqual(expected);
    return { titles };
  },
});
