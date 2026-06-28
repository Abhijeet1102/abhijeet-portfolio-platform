import { test, expect } from '@playwright/test';

test.describe('Admin Flows', () => {
  // Use a mock or a seeded local DB for these tests if possible, 
  // or just check UI renders correctly without full E2E data mutation.
  
  test('should redirect to login if not authenticated', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*\/admin\/login/);
  });

  test('should render login page', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('h1')).toContainText('Admin Login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should fail login with invalid credentials', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // We expect an error toast or message
    await expect(page.getByText(/Invalid credentials/i)).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Public AI Assistant', () => {
  test('should render AI Assistant accessible', async ({ page }) => {
    await page.goto('/assistant');
    await expect(page.locator('h2')).toContainText('AI Assistant');
    await expect(page.locator('input[placeholder*="Type a message"]')).toBeVisible();
  });
});
