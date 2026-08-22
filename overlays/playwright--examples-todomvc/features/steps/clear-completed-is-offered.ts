// Responsibility: check that the footer is offering Clear completed.

import { expect } from "playwright/test";
import { defineStep, z } from "nukadoko";
import { clearCompletedButton } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the Clear completed button is offered",
  description: "Check that the footer is showing the Clear completed button",
  args: z.object({}),
  returns: z.object({
    label: z.string().describe("The button's own text as the page rendered it"),
  }),
  mutates: false,
  async run({ page }) {
    const button = clearCompletedButton(page);
    await expect(button).toBeVisible();
    return { label: (await button.innerText()).trim() };
  },
});
