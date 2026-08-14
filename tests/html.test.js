import { describe, expect, it } from "vitest";
import { loadDist } from "./helpers.js";

const faqTitles = [
  "How do I create an account?",
  "I forgot my password. What should I do?",
  "How do I update my profile information?",
];

function navRegion(document, selector) {
  const region = document.querySelector(selector);
  expect(region, `missing nav region ${selector}`).not.toBeNull();
  return region;
}

describe("HTML contracts", () => {
  it("renders the home layout shell", () => {
    const { document } = loadDist("index.html");

    expect(document.documentElement.getAttribute("lang")).toBe("en");
    expect(document.title).toBe("Eleventy Daisy");
    expect(
      document.querySelector('a[href="/"]')?.textContent.trim(),
    ).toBe("Eleventy Daisy");
    expect(document.querySelector('script[src="/assets/js/main.js"]')).toBeNull();
  });

  it("keeps mobile and desktop nav links in sync", () => {
    const { document } = loadDist("index.html");
    const mobileNav = navRegion(document, ".sm\\:hidden");
    const desktopNav = navRegion(document, ".sm\\:block");

    for (const href of [
      "/components/data-display/collapse",
      "/components/data-display/accordion",
    ]) {
      expect(mobileNav.querySelector(`a[href="${href}"]`)).not.toBeNull();
      expect(desktopNav.querySelector(`a[href="${href}"]`)).not.toBeNull();
    }
  });

  it("renders collapse as a DaisyUI details widget", () => {
    const { document } = loadDist(
      "components/data-display/collapse/index.html",
    );
    const details = document.querySelector("details.collapse");
    const summary = details?.querySelector("summary.collapse-title");

    expect(details).not.toBeNull();
    expect(summary).not.toBeNull();
    expect(summary.textContent.trim()).toBe(faqTitles[0]);
  });

  it("renders accordion items from the faqs collection", () => {
    const { document } = loadDist(
      "components/data-display/accordion/index.html",
    );
    const titles = [...document.querySelectorAll("summary.collapse-title")].map(
      (el) => el.textContent.trim(),
    );

    expect(titles).toEqual(expect.arrayContaining(faqTitles));
    expect(titles).toHaveLength(faqTitles.length);
  });
});
