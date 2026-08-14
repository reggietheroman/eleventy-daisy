import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadDist } from "./helpers.js";

const pages = [
  "index.html",
  "components/data-display/collapse/index.html",
  "components/data-display/accordion/index.html",
  "samples/index.html",
  "samples/single-page/corporate-workshop/index.html",
  "samples/single-page/local-service-provider/index.html",
  "samples/single-page/event-venue-restaurant-booking/index.html",
  "samples/single-page/store-boutique-or-cafe/index.html",
  "samples/single-page/digital-product-or-micro-saas/index.html",
  "samples/single-page/consultant-or-coach/index.html",
  "collections/blog-posts/post-1/index.html",
  "collections/blog-posts/post-2/index.html",
  "collections/blog-posts/post-3/index.html",
];

describe("build output", () => {
  it.each(pages)("emits %s", (relativePath) => {
    expect(existsSync(join("dist", relativePath))).toBe(true);
  });

  it("emits a non-empty stylesheet", () => {
    const cssPath = join("dist", "assets/css/styles.css");
    expect(existsSync(cssPath)).toBe(true);
    expect(statSync(cssPath).size).toBeGreaterThan(0);
  });

  it("links the production stylesheet from the layout", () => {
    const { document } = loadDist("index.html");
    const stylesheet = document.querySelector(
      'link[rel="stylesheet"][href="/assets/css/styles.css"]',
    );

    expect(stylesheet).not.toBeNull();
  });
});
