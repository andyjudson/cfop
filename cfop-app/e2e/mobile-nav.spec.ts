import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 393, height: 852 } });

test('nav icons and hamburger are grouped on the right', async ({ page }) => {
  await page.goto('/');
  const navIcons = page.locator('.cfop-nav-icons');
  const hamburger = page.locator('.navbar-burger');
  await expect(navIcons).toBeVisible();
  await expect(hamburger).toBeVisible();
  // Both should be in the navbar-brand (right side on mobile)
  const brand = page.locator('.navbar-brand');
  await expect(brand.locator('.cfop-nav-icons')).toBeVisible();
  await expect(brand.locator('.navbar-burger')).toBeVisible();
});

test('hamburger opens the nav menu', async ({ page }) => {
  await page.goto('/');
  await page.locator('.navbar-burger').click();
  await expect(page.locator('.navbar-menu.is-active')).toBeVisible();
  await expect(page.locator('.cfop-navbar-link').first()).toBeVisible();
});

test('hamburger closes the nav menu', async ({ page }) => {
  await page.goto('/');
  await page.locator('.navbar-burger').click();
  await expect(page.locator('.navbar-menu.is-active')).toBeVisible();
  await page.locator('.navbar-burger').click();
  await expect(page.locator('.navbar-menu.is-active')).not.toBeVisible();
});
