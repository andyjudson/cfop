import { test, expect } from '@playwright/test';

test('practice modal opens with scramble displayed', async ({ page }) => {
  await page.goto('/');
  await page.click('[aria-label="Open practice timer"]');
  await expect(page.locator('.practice-modal')).toBeVisible();
  await expect(page.locator('.scramble-text')).toBeVisible();
  const scramble = await page.locator('.scramble-text').textContent();
  expect(scramble?.trim().length).toBeGreaterThan(0);
});

test('spacebar starts and stops the timer, recording a time', async ({ page }) => {
  await page.goto('/');
  await page.click('[aria-label="Open practice timer"]');
  await expect(page.locator('.practice-modal')).toBeVisible();
  await page.keyboard.press('Space');
  await page.waitForTimeout(500);
  await page.keyboard.press('Space');
  // After stopping, the timer display should show a numeric time
  const timerText = await page.locator('.timer-display').textContent();
  expect(timerText).toMatch(/\d/);
});

test('last time and best time labels are visible after one solve', async ({ page }) => {
  await page.goto('/');
  await page.click('[aria-label="Open practice timer"]');
  await expect(page.locator('.practice-modal')).toBeVisible();
  await page.keyboard.press('Space');
  await page.waitForTimeout(300);
  await page.keyboard.press('Space');
  await expect(page.locator('.stats-display')).toBeVisible();
  const statsText = await page.locator('.stats-display').textContent();
  expect(statsText).toMatch(/last/i);
  expect(statsText).toMatch(/best/i);
});

test('champion mode loads a competition name', async ({ page }) => {
  await page.goto('/');
  await page.click('[aria-label="Open practice timer"]');
  await expect(page.locator('.practice-modal')).toBeVisible();
  await page.click('[aria-label="Competitive mode"]');
  await expect(page.locator('.block-caption')).toBeVisible({ timeout: 10000 });
  const caption = await page.locator('.block-caption').first().textContent();
  expect(caption?.trim().length).toBeGreaterThan(0);
});

test('champion mode shows at least one scramble', async ({ page }) => {
  await page.goto('/');
  await page.click('[aria-label="Open practice timer"]');
  await expect(page.locator('.practice-modal')).toBeVisible();
  await page.click('[aria-label="Competitive mode"]');
  await expect(page.locator('.scramble-text').first()).toBeVisible({ timeout: 10000 });
});
