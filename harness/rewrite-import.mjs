#!/usr/bin/env node
// Responsibility: mechanical import-specifier rewrite, `@cucumber/cucumber`
// -> `nukadoko/compat` (docs/migration.md "Stage 1 — switch the import"),
// applied to a corpus *working copy* only — never to the submodule itself
// (harness/run-target.mjs copies the corpus subpath out to
// `.nukadoko-work/` before calling this). No other change: source text is
// otherwise byte-for-byte what the corpus shipped.
//
// A plain string/regex substitution, not an AST rewrite: every corpus
// import of `@cucumber/cucumber` names it as a quoted string literal
// (`from "@cucumber/cucumber"`, `require("@cucumber/cucumber")`, a dynamic
// `import("@cucumber/cucumber")`, or a namespace `require(...)` — see
// nukadoko's findings-corpus.md, A6/A7 — all of which are just the same
// quoted string in different surrounding syntax), so matching the quoted
// specifier itself covers every call shape without needing a parser.
// `node_modules` is skipped so a rewrite never reaches into a dependency's
// own source.

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

// Matches `@cucumber/cucumber` only when followed immediately by the quote
// that opened it — the lookahead keeps `@cucumber/cucumber-expressions`
// (a real, unrelated package this corpus set could plausibly import) from
// matching, since that name has no closing quote at this position.
const IMPORT_SPECIFIER_PATTERN = /@cucumber\/cucumber(?=["'])/g;
const REWRITTEN_SPECIFIER = "nukadoko/compat";

// Source file extensions a corpus's own step/support files can plausibly
// use (findings-corpus.md: JS and TS corpora, CJS and ESM). `.json`/`.md`/
// lockfiles etc. are deliberately not in this set — the rewrite is scoped
// to source that can `import`/`require`, not incidental text mentions.
const SOURCE_EXTENSIONS = new Set([".js", ".mjs", ".cjs", ".ts", ".mts", ".cts", ".tsx", ".jsx"]);

const SKIP_DIR_NAMES = new Set(["node_modules", ".git"]);

/**
 * Walks `dir` recursively and rewrites the `@cucumber/cucumber` import
 * specifier to `nukadoko/compat` in every source file found. Returns the
 * list of files actually changed (relative to `dir`), so a caller can log
 * or assert on it.
 */
export function rewriteImports(dir) {
  const changed = [];
  walk(dir, dir, changed);
  return changed;
}

function walk(root, current, changed) {
  for (const entry of readdirSync(current, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.isDirectory()) {
      // Dotfiles/dirs (e.g. `.git`) are skipped wholesale; SKIP_DIR_NAMES
      // below also excludes `node_modules`, which doesn't start with `.`.
      continue;
    }
    const fullPath = path.join(current, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIR_NAMES.has(entry.name)) continue;
      walk(root, fullPath, changed);
      continue;
    }
    if (!entry.isFile()) continue;
    if (!SOURCE_EXTENSIONS.has(path.extname(entry.name))) continue;

    const original = readFileSync(fullPath, "utf8");
    if (!IMPORT_SPECIFIER_PATTERN.test(original)) continue;
    IMPORT_SPECIFIER_PATTERN.lastIndex = 0; // .test() above advanced it (global flag)

    const rewritten = original.replace(IMPORT_SPECIFIER_PATTERN, REWRITTEN_SPECIFIER);
    writeFileSync(fullPath, rewritten);
    changed.push(path.relative(root, fullPath));
  }
}

// CLI entry: `node harness/rewrite-import.mjs <dir>` — used standalone for
// inspection/debugging; harness/run-target.mjs imports `rewriteImports`
// directly instead of shelling out to this.
if (import.meta.url === `file://${process.argv[1]}`) {
  const target = process.argv[2];
  if (!target) {
    console.error("usage: node harness/rewrite-import.mjs <dir>");
    process.exit(1);
  }
  const stat = statSync(target, { throwIfNoEntry: false });
  if (!stat || !stat.isDirectory()) {
    console.error(`not a directory: ${target}`);
    process.exit(1);
  }
  const changed = rewriteImports(path.resolve(target));
  for (const file of changed) {
    console.log(file);
  }
}
