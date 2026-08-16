# nukadoko-compat-lab

Runs real, unmodified cucumber-js corpora through
[nukadoko](https://github.com/meganemura/nukadoko)'s compat door
(`nukadoko/compat`) to measure whether they actually pass, rather than
auditing their glue as text. Three targets so far: `esm-node` and
`typescript-node-esm` (from `cucumber/cucumber-js-examples`), and
`cucumber7-ts-starter` (from `hdorgeval/cucumber7-ts-starter`).
`cloudevents/sdk-javascript` was also investigated as a fourth target,
across several rounds of harness fixes, but was abandoned after hitting
an unresolvable Node.js ESM/CJS interop limit: a `.cjs`-style file this
corpus generates at build time reassigns `module.exports` after its
initial declaration, a pattern Node can't statically resolve to a named
`default` export when the working copy is loaded as ESM.

## Layout

- `corpora/` — corpus repositories, as git submodules, pinned to a specific
  commit. Never modified in place.
- `harness/` — the scripts that drive a target through nukadoko.
  - `targets.json` — one entry per target: which submodule, which subpath,
    where its feature files live, how many scenarios it's expected to run.
  - `rewrite-import.mjs` — rewrites the `@cucumber/cucumber` import
    specifier to `nukadoko/compat` in a working copy (never in the
    submodule itself).
  - `run-target.mjs` — copies a target's corpus subpath to a scratch
    working copy, rewrites its imports, installs nukadoko into the copy,
    then runs `nuka run` / `nuka check --json` / `nuka tend --json`
    against it and writes one result JSON.
  - `render-readme.mjs` — rolls `results/*/*.json` up into the table below.
- `results/<target-id>/` — one JSON file per (target, track) result.
  `<semver>.json` is a permanent snapshot of that released nukadoko
  version's first run (never regenerated once written); `main.json`
  always reflects the current tip of nukadoko's `main` branch and is
  overwritten on every run.

## Two tracks

- **npm track** (`--track=npm`): installs `nukadoko@latest` from the npm
  registry — what an actual adopter would get today.
- **main track** (`--track=main`): clones
  `https://github.com/meganemura/nukadoko` into `.nukadoko-main-clone/`
  (git-ignored, not a submodule), runs `npm run build` there, and runs
  against that build — where nukadoko's own development currently stands,
  ahead of any npm release.

## Running it

```sh
# once, after cloning this repo:
git submodule update --init --recursive

# run one target on one track (regenerates results/<target-id>/<file>.json):
node harness/run-target.mjs esm-node --track=npm
node harness/run-target.mjs esm-node --track=main

# roll the current results/*/*.json up into the table below:
node harness/render-readme.mjs
```

`run-target.mjs`'s pass/fail judgement (the `overall` column below) is
`nuka run`'s exit code being 0 **and** its scenario count meeting
`targets.json`'s `expectedScenarioCount` — exit 0 alone doesn't rule out a
run that silently discovered zero scenarios (false-green).

**Resolved as of nukadoko 0.3.0**: `esm-node`'s step definitions are a
plain `.js` file. Through nukadoko 0.0.5, step-file discovery only walked
`.ts` files under `featuresDir` (`walkTsFiles` in `discover-steps.ts`), so
this target reported 0 scenarios discovered / `check` errors on both
tracks. By 0.3.0, discovery (renamed `walkStepFiles`) also walks
`.mts`/`.js`/`.mjs`, and this target now passes cleanly on both tracks
(`run` 0 exit / 1 scenario, `check` 0, `tend` 0) — see the Results table
below.

**Known gap #2**: `cucumber7-ts-starter` spreads its glue across sibling
top-level directories (`features/`, `step-definitions/`, `hooks/`,
`world/`, `env/`) with no common parent besides the repo root, so its
target sets `featuresDir: "."`. One of those siblings,
`env/set-environment-variables.ts`, has nothing to do with step
definitions but does a plain CommonJS `require('is-ci')` — and nuka's
step discovery walks *every* `.ts` file under `featuresDir`, not just
ones that register steps. That `require()` throws mid-import in nuka's
ESM-only loader, and `nuka run` has no tolerant mode, so the whole
discovery aborts: 0/2 scenarios, every track. (`nuka check` *does* have a
tolerant mode and correctly names the file via `step-file-import-failed`
— the diagnosis is honest, it's `run` that can't recover from it.)
**Update as of nukadoko 0.3.0**: the `node_modules` half of this is fixed.
`walkStepFiles` (the renamed `walkTsFiles`) now skips `node_modules` and
any dot-directory at every depth, so on the npm track `check`/`tend` no
longer walk into `node_modules/nukadoko` and hang — the unsettled
top-level await / exit 13 is gone. Both now complete cleanly: `check`
exits 1 and reports two `step-file-import-failed` entries (the known
`env/set-environment-variables.ts` `require()`, plus a second one,
`step-definitions/maths/simple-maths-steps.ts` failing to resolve the
`expect` package — a harness working-copy artifact, not a nukadoko gap:
the minimal `package.json` `run-target.mjs` writes deliberately skips the
corpus's own devDependencies, so `expect@26.6.2` is simply absent; this
was previously never reached because discovery hung before getting that
far); `tend` exits 0 with an `import-failures-unseen` note
naming both files. `run` is unaffected by this fix — `env/` sorts before
`node_modules` alphabetically, so its walk already hit the `require()`
error before `node_modules` would ever have come up, exclusion or not —
and it still aborts at the `require()` above with 0/2 scenarios, same as
before. Both were nukadoko-side step-discovery gaps, not something this
harness works around by editing the corpus.

## Results

<!-- RESULTS:START (generated by harness/render-readme.mjs — do not hand-edit) -->

| target | track | version / commit | run (exit, scenarios) | check (exit) | tend (exit) | overall |
|---|---|---|---|---|---|---|
| cucumber-js-examples--esm-node | npm | 0.3.0 | 0 (1/1) | 0 | 0 | PASS |
| cucumber-js-examples--esm-node | npm | 0.0.5 | 1 (1/1) | 1 | 0 | FAIL |
| cucumber-js-examples--esm-node | npm | 0.0.4 | 1 (1/1) | 1 | 0 | FAIL |
| cucumber-js-examples--esm-node | main | 450d068ae8b1 | 0 (1/1) | 0 | 0 | PASS |
| cucumber-js-examples--typescript-node-esm | npm | 0.3.0 | 0 (1/1) | 0 | 0 | PASS |
| cucumber-js-examples--typescript-node-esm | npm | 0.0.5 | 0 (1/1) | 0 | 0 | PASS |
| cucumber-js-examples--typescript-node-esm | npm | 0.0.4 | 0 (1/1) | 0 | 0 | PASS |
| cucumber-js-examples--typescript-node-esm | main | 450d068ae8b1 | 0 (1/1) | 0 | 0 | PASS |
| cucumber7-ts-starter--. | npm | 0.3.0 | 1 (0/2) | 1 | 0 | FAIL |
| cucumber7-ts-starter--. | npm | 0.0.5 | 1 (0/2) | 13 | 13 | FAIL |
| cucumber7-ts-starter--. | main | 450d068ae8b1 | 1 (0/2) | 1 | 0 | FAIL |

<!-- RESULTS:END -->
