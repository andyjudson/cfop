import { test, expect } from '@playwright/test';

test('about page loads with heading and WR chart section', async ({ page }) => {
  await page.goto('/#/about');
  await expect(page.locator('.section-title').first()).toBeVisible();
  await expect(page.locator('.wr-chart-container, .recharts-responsive-container').first()).toBeVisible({ timeout: 10000 });
});

test('algorithm pages render cards', async ({ page }) => {
  // BGR page has cards always visible (no expand/collapse)
  await page.goto('/#/2lk');
  await expect(page.locator('.algo-card').first()).toBeVisible({ timeout: 10000 });
});

test('PLL page renders cards after expand all', async ({ page }) => {
  await page.goto('/#/pll');
  await page.click('[aria-label="Expand all algorithm sections"]');
  await expect(page.locator('.algo-card').first()).toBeVisible({ timeout: 10000 });
});

test('notation and intuitive pages render section headings', async ({ page }) => {
  for (const route of ['/#/notation', '/#/intuitive']) {
    await page.goto(route);
    await expect(page.locator('.section-title').first()).toBeVisible();
  }
});

test('nav link navigates to correct page', async ({ page }) => {
  await page.goto('/#/about');
  // Open hamburger menu to reveal nav links
  await page.locator('.navbar-burger').click();
  await page.locator('.cfop-navbar-link', { hasText: 'Beginner' }).click();
  await expect(page).toHaveURL(/\/#\/2lk/);
  await expect(page.locator('.algo-card').first()).toBeVisible({ timeout: 10000 });
});
