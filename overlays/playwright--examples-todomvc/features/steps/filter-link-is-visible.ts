// Responsibility: check that one of the footer's filter links is on screen.

import { expect } from "playwright/test";
import { defineStep, z } from "nukadoko";
import { filterLink } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the {filter:string} filter link is visible",
  description: "Check that one of the footer filter links is on screen",
  args: z.object({
    filter: z.string().describe("The filter link's own label"),
  }),
  returns: z.object({
    href: z.string().describe("The href the link carried"),
  }),
  mutates: false,
  async run({ page }, args) {
    const link = filterLink(page, args.filter);
    await expect(link).toBeVisible();
    return { href: (await link.getAttribute("href")) ?? "" };
  },
});
