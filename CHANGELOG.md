# Changelog

All notable changes to the Neon Tokyo theme.

## Unreleased

- Licensed under MIT (`LICENSE`); `package.json` `license` changed from `UNLICENSED` to `MIT`.

## 0.2.0 — 2026-04-21

### BREAKING

- `fonts.css` is no longer auto-imported by `index.css`. Consumers must load fonts themselves. See `README.md` "Fonts" section for the three recommended strategies.

### Why

Mode 2/3 plain-HTML consumers had no way to opt out of the Google Fonts CDN request, forcing a third-party dependency and GDPR exposure. Framework consumers (Next.js, Astro) using native font loaders ended up double-loading. Making fonts opt-in restores consumer control.

### Migration

- Plain-HTML / Mode 2 / Mode 3 consumers: add `@import "neon-tokyo/styles/fonts.css"` to your CSS entry after `@import "neon-tokyo/..."`.
- Next.js / Astro / framework consumers using `next/font`-style loaders: no change needed (or remove the now-redundant theme-side font import if you had one).

## 0.1.0

Initial release.
