// Responsibility: check the address the browser is on, which is how the
// filter links report which filter is active.

import { expect } from "playwright/test";
import { defineStep, z } from "nukadoko";

export default defineStep({
  pattern: "the URL ends with {suffix:string}",
  description: "Check that the browser's address ends with this text",
  args: z.object({
    suffix: z.string().describe("The expected end of the URL, such as \"#/active\""),
  }),
  returns: z.object({
    url: z.string().describe("The whole URL the browser was on"),
  }),
  mutates: false,
  rationale:
    "Takes a suffix rather than a whole URL so the same line works against any deployment; the whole URL still lands on the record, which is what a failure is read from.",
  async run({ page }, args) {
    await expect(page).toHaveURL(new RegExp(`${escapeForRegExp(args.suffix)}$`));
    return { url: page.url() };
  },
});

function escapeForRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
