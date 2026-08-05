#!/usr/bin/env node
// Responsibility: drive one target through nukadoko directly (.claude-team/
// mvp-esm-node/spec.md "差込機構は「直接駆動」" — corpus's own `npm test`/
// `cucumber-js` bin is never invoked; this script always calls `nuka` on the
// corpus's features itself). One invocation = one target, one track:
//
//   node harness/run-target.mjs <target-name> --track=npm|main
//
// Steps: copy the corpus subpath to a scratch working copy -> rewrite its
// `@cucumber/cucumber` imports (harness/rewrite-import.mjs) -> install
// nukadoko into that copy (npm track: `npm install nukadoko@<latest>`; main
// track: build a local clone of github.com/meganemura/nukadoko and symlink
// it in) -> run `nuka run`/`check`/`tend` against the copy -> write one
// result JSON to results/<target-id>/<file>.json.
//
// Deviation from the task spec's literal `nuka run --json`: `nuka run` (see
// nukadoko src/cli/run-cli.ts's `runCommand` builder) has no `--json`
// option — only `check`/`tend` do. Passing `--json` to `run` fails yargs'
// `.strict()` parse (exit 1, nothing runs) rather than requesting JSON.
// `nuka run` already writes one JSON scenario record per line to stdout
// unconditionally (src/cli/run.ts), so that stream is captured and parsed
// the same way `--json` output from `check`/`tend` is, and `run` is invoked
// without the flag. Recorded here rather than guessed past silently.

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { rewriteImports } from "./rewrite-import.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TARGETS_PATH = path.join(REPO_ROOT, "harness", "targets.json");
const CORPORA_DIR = path.join(REPO_ROOT, "corpora");
const RESULTS_DIR = path.join(REPO_ROOT, "results");
const WORK_DIR = path.join(REPO_ROOT, ".nukadoko-work");
const MAIN_CLONE_DIR = path.join(REPO_ROOT, ".nukadoko-main-clone");
const MAIN_REPO_URL = "https://github.com/meganemura/nukadoko.git";

function parseArgs(argv) {
  let name = null;
  let track = null;
  for (const arg of argv) {
    if (arg.startsWith("--track=")) {
      track = arg.slice("--track=".length);
    } else if (arg === "--track") {
      throw new Error("use --track=npm or --track=main (no space form)");
    } else if (!arg.startsWith("-")) {
      name = arg;
    }
  }
  if (!name) throw new Error("usage: node harness/run-target.mjs <target-name> --track=npm|main");
  if (track !== "npm" && track !== "main") {
    throw new Error(`--track must be "npm" or "main", got ${JSON.stringify(track)}`);
  }
  return { name, track };
}

function loadTargets() {
  return JSON.parse(readFileSync(TARGETS_PATH, "utf8")).targets;
}

function targetId(target) {
  return `${target.submodule}--${target.subpath.replace(/\//g, "-")}`;
}

// Minimal resolver for the one glob shape targets.json actually uses
// (`<dir>/**/*.<ext>`) — not a general glob implementation. Splits at the
// first `**` segment for the search root, and matches file names by the
// suffix after the last `*`.
function resolveFeatureFiles(workDir, glob) {
  const starIndex = glob.indexOf("*");
  const rootSegment = starIndex === -1 ? glob : glob.slice(0, starIndex).replace(/\/$/, "");
  const suffix = glob.slice(glob.lastIndexOf("*") + 1);
  const root = path.join(workDir, rootSegment);
  const found = [];
  const walk = (dir) => {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith(suffix)) {
        found.push(path.relative(workDir, full));
      }
    }
  };
  walk(root);
  return found.sort();
}

function copyCorpusSubpath(target) {
  const source = path.join(CORPORA_DIR, target.submodule, target.subpath);
  if (!existsSync(source)) {
    throw new Error(
      `corpus subpath not found: ${source} (is the submodule initialized? git submodule update --init)`,
    );
  }
  return source;
}

function prepareWorkingCopy(target, track) {
  const source = copyCorpusSubpath(target);
  const workDir = path.join(WORK_DIR, targetId(target), track);
  rmSync(workDir, { recursive: true, force: true });
  mkdirSync(workDir, { recursive: true });
  cpDir(source, workDir, new Set(["node_modules", ".git"]));

  // Harness scaffolding, not a corpus patch (spec: "コーパスは無改変で使う"
  // covers the submodule; this is the working copy's own package.json,
  // replacing the corpus's original one). A fresh minimal file avoids the
  // corpus's own package-lock.json / devDependencies interfering with
  // installing nukadoko below, while keeping "type": "module" — required
  // for Node to load the corpus's own `.js` step files as ESM (they use
  // `import`/`export` syntax; nukadoko's discover-steps.ts loads them via
  // dynamic `import()`, which resolves module type from the nearest
  // package.json).
  rmSync(path.join(workDir, "package-lock.json"), { force: true });
  writeFileSync(
    path.join(workDir, "package.json"),
    JSON.stringify({ name: `${targetId(target)}-${track}-work`, private: true, type: "module" }, null, 2) + "\n",
  );

  // nuka init's own template (src/cli/init.ts's configTemplate) with every
  // field left at its default — esm-node's own layout already matches
  // nukadoko's default `featuresDir: "features"` (docs/migration.md "Stage
  // 0"), and this target makes no baseURL-reaching calls. `target.featuresDir`
  // is an optional targets.json field for a corpus whose features/step-
  // definitions/hooks/world/env live in separate top-level directories
  // rather than under a single conventional `features/` tree (e.g.
  // cucumber7-ts-starter) — only written into the generated config when the
  // target actually sets it, so every other target keeps getting the plain
  // `defineConfig({})` it always has.
  const configBody = target.featuresDir === undefined ? "{}" : `{\n  featuresDir: ${JSON.stringify(target.featuresDir)},\n}`;
  writeFileSync(
    path.join(workDir, "nukadoko.config.ts"),
    `import { defineConfig } from "nukadoko";\n\nexport default defineConfig(${configBody});\n`,
  );

  const changedFiles = rewriteImports(workDir);

  return { workDir, changedFiles };
}

function cpDir(source, dest, skipNames) {
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    if (skipNames.has(entry.name)) continue;
    const from = path.join(source, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      mkdirSync(to, { recursive: true });
      cpDir(from, to, skipNames);
    } else if (entry.isFile()) {
      writeFileSync(to, readFileSync(from));
    }
  }
}

function npmLatestVersion() {
  return execFileSync("npm", ["view", "nukadoko", "version"], { encoding: "utf8" }).trim();
}

// Skips downloading Chromium/Firefox/WebKit binaries during `npm install`
// (playwright is one of nukadoko's own `dependencies`) — none of this
// target's steps call `openPage()`/`openRequest()` (docs/migration.md "The
// measured upgrade"), so no browser is ever launched; downloading one would
// only slow this harness down for nothing it exercises.
const NO_BROWSER_DOWNLOAD_ENV = { ...process.env, PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: "1" };

function installNpmTrack(workDir) {
  const version = npmLatestVersion();
  const result = spawnSync(
    "npm",
    ["install", `nukadoko@${version}`, "--no-save", "--no-package-lock", "--no-audit", "--no-fund"],
    { cwd: workDir, encoding: "utf8", env: NO_BROWSER_DOWNLOAD_ENV },
  );
  if (result.status !== 0) {
    throw new Error(`npm install nukadoko@${version} failed:\n${result.stdout}\n${result.stderr}`);
  }
  return { nukadokoVersion: version };
}

function run(cmd, args, cwd) {
  const result = spawnSync(cmd, args, { cwd, encoding: "utf8", env: NO_BROWSER_DOWNLOAD_ENV });
  if (result.status !== 0 && result.error) throw result.error;
  return result;
}

function ensureMainClone() {
  if (!existsSync(MAIN_CLONE_DIR)) {
    run("git", ["clone", MAIN_REPO_URL, MAIN_CLONE_DIR], REPO_ROOT);
  } else {
    run("git", ["fetch", "origin", "main"], MAIN_CLONE_DIR);
    run("git", ["reset", "--hard", "origin/main"], MAIN_CLONE_DIR);
  }
  const install = run("npm", ["install", "--no-audit", "--no-fund"], MAIN_CLONE_DIR);
  if (install.status !== 0) {
    throw new Error(`npm install in main clone failed:\n${install.stdout}\n${install.stderr}`);
  }
  const build = run("npm", ["run", "build"], MAIN_CLONE_DIR);
  if (build.status !== 0) {
    throw new Error(`npm run build in main clone failed:\n${build.stdout}\n${build.stderr}`);
  }
  const commitSha = execFileSync("git", ["-C", MAIN_CLONE_DIR, "rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
  return commitSha;
}

function installMainTrack(workDir) {
  const commitSha = ensureMainClone();
  const nodeModules = path.join(workDir, "node_modules");
  mkdirSync(nodeModules, { recursive: true });
  const link = path.join(nodeModules, "nukadoko");
  rmSync(link, { force: true });
  symlinkSync(MAIN_CLONE_DIR, link, "dir");
  return { commitSha };
}

function nukaCliPath(workDir) {
  return path.join(workDir, "node_modules", "nukadoko", "dist", "cli.js");
}

function runNuka(cliPath, args, cwd) {
  const result = spawnSync("node", [cliPath, ...args], { cwd, encoding: "utf8" });
  return { exitCode: result.status ?? 1, stdout: result.stdout, stderr: result.stderr };
}

// `nuka run` has no `--json` (see this file's own header) — its stdout is
// already one JSON scenario record per line unconditionally.
function parseRunStdout(stdout) {
  return stdout
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line));
}

function parseJsonStdout(stdout) {
  const trimmed = stdout.trim();
  if (trimmed.length === 0) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

function resultsPathFor(id, track, versionInfo) {
  const fileName = track === "npm" ? `${versionInfo.nukadokoVersion}.json` : "main.json";
  return path.join(RESULTS_DIR, id, fileName);
}

function main() {
  const { name, track } = parseArgs(process.argv.slice(2));
  const targets = loadTargets();
  const target = targets.find((candidate) => candidate.name === name);
  if (!target) {
    throw new Error(`unknown target "${name}" (see harness/targets.json)`);
  }
  const id = targetId(target);

  // npm track only: `<semver>.json` is persistent, one per released
  // version, never regenerated once it exists (task spec "制約・前提":
  // "初回検出時に自動複製、以後上書きしない"). main track's own
  // `main.json` always overwrites (checked further down, after the
  // commitSha is known) since it tracks a moving target.
  if (track === "npm") {
    const version = npmLatestVersion();
    const existingPath = resultsPathFor(id, track, { nukadokoVersion: version });
    if (existsSync(existingPath)) {
      console.log(`${existingPath} already exists for nukadoko@${version}; not regenerating.`);
      return;
    }
  }

  const { workDir, changedFiles } = prepareWorkingCopy(target, track);
  console.log(`working copy: ${workDir}`);
  console.log(`rewritten imports in: ${changedFiles.join(", ") || "(none)"}`);

  const versionInfo = track === "npm" ? installNpmTrack(workDir) : installMainTrack(workDir);
  const cliPath = nukaCliPath(workDir);
  if (!existsSync(cliPath)) {
    throw new Error(`nukadoko CLI not found at ${cliPath} after install`);
  }

  const featureFiles = resolveFeatureFiles(workDir, target.featureGlob);
  if (featureFiles.length !== 1) {
    throw new Error(
      `expected exactly one feature file matching ${target.featureGlob} in ${workDir}, found ${featureFiles.length}: ${featureFiles.join(", ")}`,
    );
  }
  const [featureFile] = featureFiles;

  const runResult = runNuka(cliPath, ["run", featureFile], workDir);
  const scenarios = runResult.exitCode === 0 || runResult.stdout.length > 0 ? parseRunStdout(runResult.stdout) : [];
  const scenarioCount = scenarios.length;
  const runPass = runResult.exitCode === 0 && scenarioCount >= target.expectedScenarioCount;

  const checkResult = runNuka(cliPath, ["check", "--json"], workDir);
  const tendResult = runNuka(cliPath, ["tend", "--json"], workDir);

  const result = {
    targetId: id,
    targetName: target.name,
    track,
    generatedAt: new Date().toISOString(),
    ...versionInfo,
    featureFile,
    expectedScenarioCount: target.expectedScenarioCount,
    run: {
      command: `nuka run ${featureFile}`,
      note: "no --json (run has none — see this file's own header); stdout is one JSON scenario record per line, parsed below",
      exitCode: runResult.exitCode,
      scenarioCount,
      scenarios,
      stderr: runResult.stderr,
      pass: runPass,
    },
    check: {
      command: "nuka check --json",
      exitCode: checkResult.exitCode,
      json: parseJsonStdout(checkResult.stdout),
      stderr: checkResult.stderr,
      pass: checkResult.exitCode === 0,
    },
    tend: {
      command: "nuka tend --json",
      exitCode: tendResult.exitCode,
      json: parseJsonStdout(tendResult.stdout),
      stderr: tendResult.stderr,
      pass: tendResult.exitCode === 0,
    },
  };
  result.pass = result.run.pass && result.check.pass && result.tend.pass;

  const outPath = resultsPathFor(id, track, versionInfo);
  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(result, null, 2) + "\n");
  console.log(`wrote ${outPath}`);
  console.log(
    `run: exit=${runResult.exitCode} scenarios=${scenarioCount}/${target.expectedScenarioCount} pass=${runPass}`,
  );
  console.log(`check: exit=${checkResult.exitCode} pass=${result.check.pass}`);
  console.log(`tend: exit=${tendResult.exitCode} pass=${result.tend.pass}`);
}

main();
