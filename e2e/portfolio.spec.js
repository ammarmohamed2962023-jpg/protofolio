import { test, expect } from '@playwright/test';

test.describe('Portfolio E2E Tests', () => {
  test('homepage loads and shows main heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Ammar Mohamed');
  });

  test('navigation scroll spy works', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Projects');
    await expect(page.locator('#projects')).toBeInView();
  });
});
