// Responsibility: check the footer counter's own wording.

import { expect } from "playwright/test";
import { defineStep, z } from "nukadoko";
import { todoCounter } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the counter reads {counter:string}",
  description: "Check the footer counter's text, wording and number together",
  args: z.object({
    counter: z
      .string()
      .describe("The counter's expected text, such as \"1 item left\""),
  }),
  returns: z.object({
    counter: z.string().describe("The counter's text as the page rendered it"),
  }),
  mutates: false,
  rationale:
    "Checks the whole sentence rather than the number alone, because the singular and plural wording is part of what the original suite asserted.",
  async run({ page }, args) {
    const counter = todoCounter(page);
    await expect(counter).toHaveText(args.counter);
    return { counter: (await counter.innerText()).trim() };
  },
});
