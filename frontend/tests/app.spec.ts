import { test, expect } from '@playwright/test';

test.describe('CeleBrease Application Flow', () => {
  test('Home page renders without crashing', async ({ page }) => {
    const response = await page.goto('/');
    
    // Ensure the server returned a successful status code (not a 500 error)
    expect(response?.ok()).toBeTruthy();
    
    // Verify that the Next.js app hasn't crashed (no "Application Error" overlay)
    await expect(page.locator('text="Application error: a client-side exception has occurred"')).not.toBeVisible();
    await expect(page.locator('text="Internal Server Error"')).not.toBeVisible();

    // Verify key UI elements render correctly (Hero title)
    await expect(page.locator('h1').first()).toBeVisible();
    
    // Ensure the navigation bar is present
    await expect(page.getByRole('navigation').first()).toBeVisible();
  });

  test('Shop Kits page successfully fetches and renders holidays', async ({ page }) => {
    const response = await page.goto('/shop-kits');
    expect(response?.ok()).toBeTruthy();

    // Make sure shop-kits layout loads
    await expect(page.locator('h1').first()).toBeVisible();

    // Check that we aren't showing the fallback empty state or an error
    await expect(page.locator('text="Something went wrong"')).not.toBeVisible();

    // The grid should have elements
    const catalogSection = page.locator('.catalog-section');
    await expect(catalogSection).toBeVisible();
  });

  test('Subscription page loads plans and prices', async ({ page }) => {
    const response = await page.goto('/subscription');
    expect(response?.ok()).toBeTruthy();

    // Make sure comparison table loads
    await expect(page.locator('text="Everything side by side"')).toBeVisible();
    
    // Make sure the FAQ accordion renders
    await expect(page.locator('text="Subscription questions, answered"')).toBeVisible();
  });
});
