#!/usr/bin/env node
/*
 * Standalone CSS build for a theme repo.
 * Pipeline: Tailwind CLI (resolves @import + @theme) → PostCSS scoping → Lightning CSS minify.
 * Emits four artifacts under dist/:
 *   <name>.unscoped.css       tokens on :root, drop-in for single-theme sites
 *   <name>.unscoped.min.css   minified variant
 *   <name>.css                every selector scoped under [data-theme="<name>"]
 *   <name>.min.css            minified variant
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import postcss from "postcss";
import prefixSelector from "postcss-prefix-selector";
import { transform as lightningcssTransform } from "lightningcss";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));

// Derive theme short-name from package name: @optetron/theme-neon-tokyo → neon-tokyo
const THEME_NAME = pkg.name.replace(/^@[^/]+\/theme-/, "");
const DIST = resolve(root, "dist");
const SRC = resolve(root, "index.css");

if (existsSync(DIST)) rmSync(DIST, { recursive: true });
mkdirSync(DIST, { recursive: true });

// 1. Tailwind compile — resolves @import graph, folds @theme into :root, no utilities.
const RAW = resolve(DIST, "__raw.css");
execSync(
  `npx --no-install @tailwindcss/cli -i "${SRC}" -o "${RAW}" --minify=false`,
  { stdio: "inherit", cwd: root },
);

const raw = readFileSync(RAW, "utf8");
rmSync(RAW);

// 2. Unscoped dist — Tailwind output verbatim.
writeFileSync(resolve(DIST, `${THEME_NAME}.unscoped.css`), raw);

// 3. Scoped dist — wrap every top-level selector in [data-theme="<name>"].
//    Mirrors frontend/vite-plugin-theme-scope.ts::scopeCss: :root → prefix,
//    other selectors → prefix + " " + selector, @keyframes/@font-face left alone.
const scoped = (
  await postcss([
    prefixSelector({
      prefix: `[data-theme="${THEME_NAME}"]`,
      exclude: [/^@keyframes/, /^@font-face/],
      transform(prefix, selector, prefixedSelector) {
        if (selector.trim() === ":root") return prefix;
        return prefixedSelector;
      },
    }),
  ]).process(raw, { from: undefined })
).css;
writeFileSync(resolve(DIST, `${THEME_NAME}.css`), scoped);

// 4. Minify both via Lightning CSS.
const minify = (css) =>
  Buffer.from(
    lightningcssTransform({
      code: Buffer.from(css),
      minify: true,
      filename: `${THEME_NAME}.css`,
    }).code,
  ).toString();

writeFileSync(resolve(DIST, `${THEME_NAME}.unscoped.min.css`), minify(raw));
writeFileSync(resolve(DIST, `${THEME_NAME}.min.css`), minify(scoped));

const sizes = ["css", "min.css", "unscoped.css", "unscoped.min.css"]
  .map((ext) => {
    const size = readFileSync(resolve(DIST, `${THEME_NAME}.${ext}`)).length;
    return `  ${THEME_NAME}.${ext.padEnd(18)}${(size / 1024).toFixed(1).padStart(6)} KB`;
  })
  .join("\n");
console.log(`\n✓ Built ${THEME_NAME} →\n${sizes}\n`);
