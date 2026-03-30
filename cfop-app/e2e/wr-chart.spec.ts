import { test, expect } from '@playwright/test';

test('WR chart renders without error on about page', async ({ page }) => {
  await page.goto('/#/about');
  await expect(page.locator('.recharts-responsive-container').first()).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.wr-chart-error')).not.toBeAttached();
});
