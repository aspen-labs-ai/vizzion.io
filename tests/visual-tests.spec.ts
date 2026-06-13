import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';

const BASE_URL = process.env.VISUAL_BASE_URL ?? 'http://localhost:3000';
const SCREENSHOT_ROOT = process.env.VISUAL_SCREENSHOT_DIR ?? 'playwright-artifacts/visual-review';

const VIEWPORTS = {
  desktop: { width: 1920, height: 1080 },
  mobile: { width: 375, height: 667 },
} as const;

// Randomly sampled once, then pinned for deterministic regression baselines.
const INDUSTRY_PAGES = [
  '/industries/solar',
  '/industries/boat-decking',
  '/industries/windows-doors',
] as const;

mkdirSync(SCREENSHOT_ROOT, { recursive: true });

async function gotoPath(page: Page, path: string) {
  const url = new URL(path, BASE_URL).toString();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');
}

async function waitForStableRender(page: Page) {
  await page.evaluate(async () => {
    if ('fonts' in document) {
      await (document as Document & { fonts: FontFaceSet }).fonts.ready;
    }
  });

  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-delay: 0s !important;
        animation-duration: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }
    `,
  });
}

async function capture(page: Page, fileName: string) {
  await page.screenshot({
    path: join(SCREENSHOT_ROOT, fileName),
    fullPage: true,
  });
}

test.describe('Homepage visual regression checks', () => {
  for (const [label, viewport] of Object.entries(VIEWPORTS)) {
    test(`homepage visual snapshot (${label})`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await gotoPath(page, '/');
      await waitForStableRender(page);

      await expect(page.locator('header')).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

      await capture(page, `homepage-${label}.png`);
      await expect(page).toHaveScreenshot(`homepage-${label}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.03,
      });
    });
  }
});

test.describe('Industry template visual checks', () => {
  for (const path of INDUSTRY_PAGES) {
    for (const [label, viewport] of Object.entries(VIEWPORTS)) {
      test(`${path} template snapshot (${label})`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await gotoPath(page, path);
        await waitForStableRender(page);

        await expect(page.locator('header')).toBeVisible();
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expect(page.getByRole('heading', { name: /Frequently Asked Questions/i })).toBeVisible();
        await expect(page.locator('#signup')).toBeVisible();

        const safeSlug = path.replaceAll('/', '-').replace(/^-+/, '');
        await capture(page, `${safeSlug}-${label}.png`);
        await expect(page).toHaveScreenshot(`${safeSlug}-${label}.png`, {
          fullPage: true,
          maxDiffPixelRatio: 0.03,
        });
      });
    }
  }
});

test.describe('Navigation functionality', () => {
  test('desktop nav links and industries dropdown work', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await gotoPath(page, '/');

    const header = page.locator('header');
    await expect(header).toBeVisible();

    await header.getByRole('link', { name: 'Pricing' }).click();
    await expect(page).toHaveURL(/#pricing$/);
    await expect(page.locator('#pricing')).toBeVisible();

    const industriesTrigger = header.getByRole('link', { name: /^Industries$/ });
    await industriesTrigger.hover();
    await expect(page.getByRole('link', { name: 'Roofing' })).toBeVisible();

    await page.getByRole('link', { name: 'Roofing' }).click();
    await expect(page).toHaveURL(/\/industries\/roofing$/);
  });

  test('mobile nav drawer and industries accordion work', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await gotoPath(page, '/');

    const openMenuButton = page.getByRole('button', { name: /open mobile menu/i });
    await openMenuButton.click();

    const drawer = page.locator('header nav').last();
    await expect(drawer.getByRole('link', { name: 'How It Works' })).toBeVisible();

    await drawer.getByRole('button', { name: 'Industries' }).click();
    await expect(drawer.getByRole('link', { name: 'Solar Panels' })).toBeVisible();

    await drawer.getByRole('link', { name: 'Solar Panels' }).click();
    await expect(page).toHaveURL(/\/industries\/solar$/);
  });
});

test.describe('Widget/demo interactions', () => {
  test('homepage widget mockup progresses through phases', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await gotoPath(page, '/');

    await expect(page.getByText('Your customer uploads a photo of their home')).toBeVisible();
    await page.waitForTimeout(5200);
    await expect(page.getByText('They choose from your product catalog')).toBeVisible();
    await page.waitForTimeout(3200);
    await expect(page.getByText('They enter their email to see the result')).toBeVisible();

    await capture(page, 'widget-mockup-phase-flow.png');
  });

  test('industry live widget renders or shows expected fallback', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await gotoPath(page, '/industries/solar');

    const fallbackNotice = page.getByText('NEXT_PUBLIC_INDUSTRY_DEMO_WIDGET_EMBED_KEY');
    if (await fallbackNotice.count()) {
      await expect(fallbackNotice.first()).toBeVisible();
    } else {
      await expect(page.locator('#vizzion-widget-solar')).toBeVisible();
    }

    await capture(page, 'industry-live-widget-solar.png');
  });
});

test.describe('Form validation and lead flow', () => {
  test('signup form invalid/required checks', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await gotoPath(page, '/');

    const signup = page.locator('#signup');
    await signup.scrollIntoViewIfNeeded();

    const nameInput = signup.getByPlaceholder('Your Name');
    const emailInput = signup.getByPlaceholder('you@company.com');
    const industrySelect = signup.locator('select');

    await signup.getByRole('button', { name: /get started free/i }).click();

    expect(await nameInput.evaluate((el) => (el as HTMLInputElement).validity.valueMissing)).toBe(true);
    expect(await emailInput.evaluate((el) => (el as HTMLInputElement).validity.valueMissing)).toBe(true);
    expect(await industrySelect.evaluate((el) => (el as HTMLSelectElement).validity.valueMissing)).toBe(true);

    await nameInput.fill('Visual QA Tester');
    await emailInput.fill('invalid-email');
    await industrySelect.selectOption('Roofing');

    expect(await emailInput.evaluate((el) => (el as HTMLInputElement).validity.typeMismatch)).toBe(true);
  });

  test('signup success flow with mocked submit endpoint', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.route('https://formsubmit.co/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await gotoPath(page, '/');

    const signup = page.locator('#signup');
    await signup.scrollIntoViewIfNeeded();

    await signup.getByPlaceholder('Your Name').fill('Visual QA Tester');
    await signup.getByPlaceholder('you@company.com').fill('tester@example.com');
    await signup.locator('select').selectOption('Solar');
    await signup.getByPlaceholder('Tell us about your business...').fill('Playwright end-to-end visual/UX test run.');

    await signup.getByRole('button', { name: /get started free/i }).click();
    await expect(signup.getByText("Thanks! We'll be in touch soon.")).toBeVisible();

    await capture(page, 'signup-success.png');
  });

  test('signup error state with mocked 500 response', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.route('https://formsubmit.co/**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false }),
      });
    });

    await gotoPath(page, '/');

    const signup = page.locator('#signup');
    await signup.scrollIntoViewIfNeeded();

    await signup.getByPlaceholder('Your Name').fill('Visual QA Tester');
    await signup.getByPlaceholder('you@company.com').fill('tester@example.com');
    await signup.locator('select').selectOption('Roofing');

    await signup.getByRole('button', { name: /get started free/i }).click();
    await expect(signup.getByText('Something went wrong. Please try again.')).toBeVisible();

    await capture(page, 'signup-error.png');
  });
});

/**
 * Suggested execution matrix for cross-browser checks:
 *   npx playwright test visual-tests.spec.ts --project=chromium
 *   npx playwright test visual-tests.spec.ts --project=firefox
 *   npx playwright test visual-tests.spec.ts --project=webkit
 */
