import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("home page loads with DaisyUI styles", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.ok()).toBe(true);
    await expect(page.locator("h1")).toHaveText("Eleventy Daisy");

    const navbar = page.locator("header.navbar");
    await expect(navbar).toBeVisible();
    await expect(navbar).toHaveCSS("display", "flex");
  });

  test("desktop nav opens Components and reaches Collapse", async ({
    page,
  }) => {
    await page.goto("/");

    const desktopNav = page.locator(".hidden.sm\\:block");
    await desktopNav.getByText("Components", { exact: true }).click();
    await desktopNav.getByRole("link", { name: "Collapse" }).click();

    await expect(page).toHaveURL(/\/components\/data-display\/collapse\/?/);
    await expect(page.locator("details.collapse")).toBeVisible();
  });

  test("collapse details can be opened", async ({ page }) => {
    await page.goto("/components/data-display/collapse/");

    const details = page.locator("details.collapse");
    await expect(details).not.toHaveAttribute("open");

    await details.locator("summary").click();
    await expect(details).toHaveAttribute("open", "");
  });
});
