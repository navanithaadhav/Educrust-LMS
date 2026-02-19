
import { test, expect } from '@playwright/test';

// Increase default timeout for slow dev server / API
test.use({ actionTimeout: 15000, navigationTimeout: 30000 });

const BASE_URL = 'http://localhost:5173';

test('Homepage has title', async ({ page }) => {
    await page.goto(BASE_URL);
    // Match EduCrest or Educrust or LMS
    await expect(page).toHaveTitle(/EduCrest|LMS|Educrust/i);
});

test('Should display course list', async ({ page }) => {
    await page.goto(BASE_URL + '/course-list');

    // Check for search bar
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible({ timeout: 15000 });

    // Check if courses are rendered
    // Wait for at least one course card to ensure data is loaded
    // This handles the async fetch delay
    const firstCourseCard = page.locator('.grid > div').first();
    await expect(firstCourseCard).toBeVisible({ timeout: 30000 });
});

test('Should navigate to Course Details', async ({ page }) => {
    console.log('Navigating to Course List...');
    await page.goto(BASE_URL + '/course-list');

    // Wait for the grid container using specific locator
    await page.locator('div.grid.grid-cols-1.sm\\:grid-cols-2').first().waitFor();

    // Wait for specific content to ensure data is loaded
    // We know 'React Js' exists from manual testing
    const courseCard = page.getByText('React Js', { exact: false }).first();
    console.log('Waiting for "React Js" card...');
    await expect(courseCard).toBeVisible({ timeout: 15000 });

    // Click on the card
    console.log('Clicking course card...');
    await courseCard.click();

    // Wait for navigation
    console.log('Waiting for navigation...');
    await expect(page).toHaveURL(/\/course\//, { timeout: 15000 });

    // Verify details page content
    console.log('Verifying details page...');
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByText('Enroll Now').first()).toBeVisible();

    console.log('Test Complete');
});
