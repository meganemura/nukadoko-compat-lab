# playwright--examples-todomvc overlay

This is a derivative of `microsoft/playwright`'s `examples/todomvc`
example, at commit `d4e1023f6c03a8dced50eb3db88c2217e7c1a86a`. That
corpus is pinned as a submodule at `corpora/playwright`, unmodified.
This overlay is what one migration pass produced: `harness/run-target.mjs`
copies the corpus into a scratch working copy and applies this overlay
on top of it, on every run.

Apache-2.0 governs the original corpus. `LICENSE` and `NOTICE` in this
directory carry the attribution the license requires. Every changed file
under `tests/**/*.spec.ts` and `tests/fixtures.ts` carries a two-line
comment at its top marking it as modified, as Apache-2.0 4(b) requires.
`package.json` and `.gitignore` are modified too, but a JSON file and a
plain ignore list cannot carry a meaningful inline comment; they are
named here instead.

## New files

Written for this migration. None of these carry Microsoft's original
text.

- `features/*.feature`: six Gherkin features, 23 scenarios
- `features/steps/*.ts`: 33 typed nukadoko steps
- `tests/lib/todo.ts`: the shared locator and action layer both the
  Playwright spec files and the steps call
- `nukadoko.config.ts`, `allurerc.mjs`

## Modified files

Microsoft's original text, changed:

- `tests/**/*.spec.ts` (23 files) and `tests/fixtures.ts`: the inline
  Playwright locator and action calls now go through `tests/lib/todo.ts`
  instead of repeating themselves in every file
- `package.json`: added `"type": "module"`
- `.gitignore`: added nukadoko's own state directory and env files

## What this overlay proves, and what it does not

The suite still passes under `playwright test` after the move. The
harness checks this on every run; see
`results/playwright--examples-todomvc/`. The corpus submodule itself is
never touched; only a working copy is.

Nothing here is an endorsement by the Playwright project. The migration
was done here, by this project, against a Playwright example chosen
because it is a real, public, browser-driving suite, not because
Microsoft recommends nukadoko.

`recordStep` was also tried against this suite, in one file, to record a
Playwright-run step as a step record `nuka harvest` can read back. That
change is not part of this overlay: a spec file importing `nukadoko`
would mean the suite is no longer free of nukadoko imports, which is the
property this door exists to keep. The result is described in prose in
the top-level README instead.
