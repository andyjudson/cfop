import { test, expect } from '@playwright/test';

test('visualiser modal opens and player container is present', async ({ page }) => {
  await page.goto('/');
  await page.click('[aria-label="Open algorithm visualizer"]');
  await expect(page.locator('.modal-backdrop')).toBeVisible();
  await expect(page.locator('.twisty-container')).toBeVisible();
});

test('visualiser modal closes via close button', async ({ page }) => {
  await page.goto('/');
  await page.click('[aria-label="Open algorithm visualizer"]');
  await expect(page.locator('.modal-backdrop')).toBeVisible();
  await page.click('[aria-label="close"]');
  await expect(page.locator('.modal-backdrop')).not.toBeVisible();
});
