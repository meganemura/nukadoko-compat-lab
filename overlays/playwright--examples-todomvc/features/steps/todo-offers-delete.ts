// Responsibility: check that one todo row is offering its Delete button.

import { expect } from "playwright/test";
import { defineStep, z } from "nukadoko";
import { deleteButton } from "../../tests/lib/todo.js";

export default defineStep({
  pattern: "the todo {title:string} offers a Delete button",
  description: "Check that this todo row's Delete button is reachable",
  args: z.object({
    title: z.string().describe("The title of the row to look at"),
  }),
  returns: z.object({
    label: z
      .string()
      .describe("The accessible name the Delete button reported"),
  }),
  mutates: false,
  rationale:
    "The button only enters the accessibility tree while its row is hovered, so this step reads only, and the hover it depends on is a line of its own in the scenario.",
  async run({ page }, args) {
    const button = deleteButton(page, args.title);
    await expect(button).toBeVisible();
    return { label: (await button.getAttribute("aria-label")) ?? "" };
  },
});
