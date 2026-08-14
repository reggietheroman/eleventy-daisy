# AGENTS.md — eleventy-daisy

Guidance for AI agents working in this repo or using it as a starter template.

## What this project is

**eleventy-daisy** is a static-site starter built with:

| Layer | Choice |
|-------|--------|
| SSG | Eleventy 3 (`@11ty/eleventy`) |
| Templates | Handlebars (`.hbs`) via `@11ty/eleventy-plugin-handlebars` |
| CSS | Tailwind CSS 4 + DaisyUI 5 |
| Package manager | **pnpm** (required; see `package.json` `devEngines`) |
| Node | 24 (see `mise.toml`) |
| Deploy | Netlify (`netlify.toml`) or Cloudflare Pages (`wrangler.toml`) → `dist/` |

Output is a static site in `dist/`. There is no app server or database.

## Quick commands

```bash
pnpm install
pnpm start          # Eleventy --serve + Tailwind watch
pnpm build          # CSS then Eleventy → dist/
pnpm test           # Vitest (build + HTML) then Playwright smoke
pnpm test:unit      # Vitest only
pnpm test:e2e       # build then Playwright
pnpm test:watch     # Vitest watch
```

First-time e2e: `pnpm exec playwright install chromium`.

Do not introduce npm/yarn lockfiles. Prefer `pnpm` for all scripts.

## Directory map

```
src/
  _layouts/          # Page shells (base.hbs, markdown.hbs)
  _includes/         # Reusable Handlebars partials ({{> path/name}})
    data-display/    # UI widgets (collapse, accordion, …)
    layout/          # Page chrome (hero, footer, …)
    navigation/      # Nav patterns (navbar, steps, tab, …)
  components/        # Demo/docs pages that showcase partials (not the partials themselves)
  collections/       # Markdown content tagged into Eleventy collections
    blog-posts/
    faqs/
  assets/css/        # Tailwind entry: input.css → dist/assets/css/styles.css
eleventy.config.js   # Dir config, Handlebars plugin, image shortcode
tests/               # Vitest build/HTML tests (outside src/)
  e2e/               # Playwright smoke specs
```

| Path | Role |
|------|------|
| `src/_includes/**/*.hbs` | Partials. Include with `{{> category/name}}`. Pass props as hash args. |
| `src/components/**/*.hbs` | Standalone pages that demonstrate partials. Layout: `base.hbs`. |
| `src/collections/**/*.md` | Content. Use frontmatter `tags` to join a collection. |
| `src/_layouts/*.hbs` | Layouts. Pages set `layout:` in frontmatter. |
| `src/assets/css/input.css` | Tailwind + DaisyUI theme config. |

## Conventions agents must follow

### Partials vs component pages

- **Implement UI once** in `src/_includes/<category>/<name>.hbs`.
- **Demo it** (optional) in `src/components/<category>/<name>.hbs` by including the partial.
- Do not duplicate markup between `_includes` and `components`.

### Including partials

```hbs
{{> data-display/collapse
  title=someTitle
  content=someHtml
  name="optional-group-name"
}}

{{> data-display/accordion
  items=collections.faqs
}}
```

- Paths are relative to `_includes/` (no leading `_includes/`, no `.hbs`).
- Prefer DaisyUI utility classes (`btn`, `navbar`, `collapse`, `menu`, …) over custom CSS.
- Put site-wide theme and custom CSS only in `src/assets/css/input.css`.

### New pages

1. Add `src/<path>.hbs` (or nested under `components/`, etc.).
2. Frontmatter: `layout: base.hbs` and a `title`.
3. Compose with partials; keep page files thin.

### New markdown / collections

```yaml
---
title: Example
date: created
tags: blog-posts
layout: markdown.hbs
---
```

- Collection name = the `tags` value (e.g. `faqs` → `collections.faqs`).
- FAQ-style items often omit `layout` when only consumed inside partials.
- Blog-style pages use `layout: markdown.hbs` for typography (`prose`).

### Theming

In `input.css`:

```css
@plugin "daisyui" {
  themes: synthwave --default;
}
```

Change the DaisyUI theme name there. Add custom theme extensions / global rules in the same file (comments in the file mark the intended sections).

### Images

Use the `optimizedImage` async shortcode from `eleventy.config.js` when adding images under `src/`. It writes AVIF/WebP/JPEG to `dist/img/`.

### Testing

Two layers, both small. There is almost no application JS; tests assert the **built site**, not isolated Handlebars compiles.

| Layer | Command | What it covers |
|-------|---------|----------------|
| Vitest | `pnpm test:unit` | `pnpm build` once, then `dist/` pages, CSS, layout/nav/partial HTML |
| Playwright | `pnpm test:e2e` | Chromium smoke: home CSS, desktop nav, collapse open |

- Add a Vitest assertion in `tests/build.test.js` or `tests/html.test.js` when you add a page, collection, or partial that should always render.
- Add Playwright coverage in `tests/e2e/` only for CSS-driven interaction (dropdown, collapse, accordion).
- CI runs `pnpm test` via `.github/workflows/ci.yml`.

### Navbar / site identity

When rebranding, update brand strings and nav links in `src/_includes/navigation/navbar.hbs` and titles in layouts/pages. Keep mobile (`sm:hidden`) and desktop (`hidden sm:block`) menus in sync.

## Using this repo as a template (agent workflow)

When the user wants a **new site from this starter**, follow this order:

1. **Clarify** site name, purpose, DaisyUI theme (or keep default), and deploy target (Netlify / Cloudflare / other).
2. **Rebrand**
   - `package.json` `name`, `wrangler.toml` `name`
   - Titles in `src/_layouts/base.hbs`, `src/index.hbs`, navbar brand link
3. **Theme** — set DaisyUI theme in `src/assets/css/input.css`.
4. **Content model** — keep, rename, or replace `src/collections/*`; update partials that reference `collections.*`.
5. **Partials** — customize `_includes` for the product; remove unused demos under `src/components/` if the site is not a component gallery.
6. **Home page** — replace `src/index.hbs` with the real first viewport; reuse `layout/hero`, `layout/footer`, etc. when they fit.
7. **Nav** — point navbar links at real routes; drop component-gallery links unless still needed.
8. **Verify** with `pnpm start` / `pnpm build` / `pnpm test`. Do not commit `dist/` or `node_modules/`.

### Do / don't for template consumers

| Do | Don't |
|----|--------|
| Extend `_includes` and collections | Invent a parallel component system outside `_includes` |
| Use Handlebars + DaisyUI patterns already in tree | Switch to Nunjucks/Liquid or another CSS framework without an explicit request |
| Keep pages thin; logic in partials | Dump large HTML only in page files |
| Use `pnpm` scripts as defined | Add a second CSS pipeline or change `input`/`output` dirs casually |

## Config touchpoints

- **Eleventy dirs / markdown engine**: `eleventy.config.js` (`input: src`, `output: dist`, `includes: _includes`, `layouts: _layouts`, `markdownTemplateEngine: "hbs"`).
- **Build order**: CSS must run before or alongside Eleventy so `dist/assets/css/styles.css` exists (see `pnpm build` / `pnpm start`).
- **Pass-through assets**: if adding JS/fonts/images that are not processed by the image shortcode, configure Eleventy passthrough copy in `eleventy.config.js` and link from the layout.

## Out of scope unless asked

- Changing SSG, template language, or CSS framework
- Adding a backend, auth, or CMS integration
- Rewriting DaisyUI components in custom CSS
