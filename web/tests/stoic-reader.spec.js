/**
 * Playwright interactive test suite for The Stoic Reader.
 *
 * Run from web/tests/:
 *   npm install
 *   npx playwright install chromium
 *   npm test
 *
 * To capture initial visual regression baselines:
 *   npm run test:update-snapshots
 */

const { test, expect } = require('@playwright/test');

// ── helpers ──────────────────────────────────────────────────────────────────

/** Wait for the app to finish loading and show a quote. */
async function waitForQuote(page) {
    await page.goto('/');
    await expect(page.locator('#quote a')).toBeVisible({ timeout: 15000 });
}

/** Open the work modal by clicking the displayed quote text. */
async function openWorkModal(page) {
    await page.locator('#quote a label[for="modal-toggle"]').click();
    await expect(page.locator('#modal')).toBeVisible();
    // Wait for the loading indicator to hide — that means content has been injected
    // (either real partitions or a "coming soon" placeholder).
    await expect(page.locator('#modal-loading')).toBeHidden({ timeout: 15000 });
}

// ── smoke tests ───────────────────────────────────────────────────────────────

test.describe('Smoke', () => {
    test('page loads and shows a quote with citation', async ({ page }) => {
        await waitForQuote(page);
        await expect(page.locator('#quote a')).not.toBeEmpty();
        await expect(page.locator('#citation')).not.toBeEmpty();
    });

    test('no uncaught JS errors on load', async ({ page }) => {
        const errors = [];
        page.on('pageerror', err => errors.push(err.message));
        await waitForQuote(page);
        expect(errors).toHaveLength(0);
    });

    test('copyright year is set to current year', async ({ page }) => {
        await waitForQuote(page);
        const year = String(new Date().getFullYear());
        await expect(page.locator('#copyright-year')).toHaveText(year);
    });
});

// ── quote interaction ─────────────────────────────────────────────────────────

test.describe('Quote interaction', () => {
    test.beforeEach(async ({ page }) => waitForQuote(page));

    test('clicking the quote opens the work modal with content', async ({ page }) => {
        await openWorkModal(page);
        await expect(page.locator('#modal-title')).not.toBeEmpty();
        await expect(page.locator('#modal-body')).not.toBeEmpty();
    });

    test('clicking the work link in the citation opens the work from the start', async ({ page }) => {
        await page.locator('#workLink label[for="modal-toggle"]').click();
        await expect(page.locator('#modal')).toBeVisible();
        await expect(page.locator('#modal-body')).not.toBeEmpty({ timeout: 15000 });
    });

    test('clicking a location link in the citation opens the work at that location', async ({ page }) => {
        // The citation has at least one location link (loc0Link)
        await page.locator('#loc0Link label[for="modal-toggle"]').click();
        await expect(page.locator('#modal')).toBeVisible();
        await expect(page.locator('#modal-body')).not.toBeEmpty({ timeout: 15000 });
    });
});

// ── author biography ──────────────────────────────────────────────────────────

test.describe('Author biography', () => {
    test.beforeEach(async ({ page }) => waitForQuote(page));

    test('clicking the author link opens the biography modal', async ({ page }) => {
        await page.locator('#authorLink label[for="modal-toggle"]').click();
        await expect(page.locator('#modal')).toBeVisible();
        // Bio modal should contain an image and the bio text.
        // Use a generous timeout because the bio may be fetched lazily.
        await expect(page.locator('#modal-image')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('#modal-text')).not.toBeEmpty({ timeout: 15000 });
    });
});

// ── modal controls ────────────────────────────────────────────────────────────

test.describe('Modal controls', () => {
    test.beforeEach(async ({ page }) => {
        await waitForQuote(page);
        await openWorkModal(page);
    });

    test('close button dismisses the modal', async ({ page }) => {
        await page.locator('#modal-close').click();
        await expect(page.locator('#modal')).not.toBeVisible();
    });

    test('clicking the overlay dismisses the modal', async ({ page }) => {
        // The overlay sits behind the modal content (z-index 50 vs 51).  Click at the
        // top-left corner of the viewport where the overlay is exposed and not covered
        // by the modal-content box.
        await page.mouse.click(10, 10);
        await expect(page.locator('#modal')).not.toBeVisible();
    });

    test('fullscreen toggle adds fullscreen class on first click', async ({ page }) => {
        const content = page.locator('#modal-content');
        await expect(content).not.toHaveClass(/fullscreen/);
        await page.locator('#modal-fullscreen').click();
        await expect(content).toHaveClass(/fullscreen/);
    });

    test('fullscreen toggle removes fullscreen class on second click', async ({ page }) => {
        const content = page.locator('#modal-content');
        await page.locator('#modal-fullscreen').click();
        await expect(content).toHaveClass(/fullscreen/);
        await page.locator('#modal-fullscreen').click();
        await expect(content).not.toHaveClass(/fullscreen/);
    });

    test('closing the modal resets currentView to quote', async ({ page }) => {
        await page.locator('#modal-close').click();
        await expect(page.locator('#modal')).not.toBeVisible();
        // After close, the quote should still be visible
        await expect(page.locator('#quote a')).toBeVisible();
    });
});

// ── menu navigation ───────────────────────────────────────────────────────────

test.describe('Menu navigation', () => {
    test.beforeEach(async ({ page }) => waitForQuote(page));

    test('menu opens when the OPEN BOOK button is clicked', async ({ page }) => {
        await page.locator('#menu-open-button').click();
        await expect(page.locator('#menu')).toBeVisible();
    });

    test('menu is populated with dynamically generated author sections', async ({ page }) => {
        await page.locator('#menu-open-button').click();
        // Each author should have a toggle label built by buildMenu()
        await expect(page.locator('#menu label[for="author-1-toggle"]')).toBeVisible();
        await expect(page.locator('#menu label[for="author-2-toggle"]')).toBeVisible();
        await expect(page.locator('#menu label[for="author-3-toggle"]')).toBeVisible();
        await expect(page.locator('#menu label[for="author-4-toggle"]')).toBeVisible();
    });

    test('expanding an author section reveals its works', async ({ page }) => {
        await page.locator('#menu-open-button').click();
        // Expand Marcus Aurelius (author id=1)
        await page.locator('label[for="author-1-toggle"]').click();
        await expect(
            page.locator('#menu .menu-author-item').filter({ hasText: 'Marcus Aurelius' })
               .locator('a', { hasText: 'Meditations' })
        ).toBeVisible();
    });

    test('clicking Meditations in the menu opens the book', async ({ page }) => {
        await page.locator('#menu-open-button').click();
        await page.locator('label[for="author-1-toggle"]').click();

        const link = page.locator('#menu .menu-author-item')
            .filter({ hasText: 'Marcus Aurelius' })
            .locator('a', { hasText: 'Meditations' });
        await link.click();

        await expect(page.locator('#modal')).toBeVisible();
        await expect(page.locator('#modal-title')).toHaveText(/meditations/i);
        // Meditations starts with Book I
        await expect(page.locator('#modal-body')).toContainText('Book I', { timeout: 15000 });
    });

    test('clicking Random Quote keeps the app functional', async ({ page }) => {
        await page.locator('#menu-open-button').click();
        await page.locator('#menu a', { hasText: 'Random Quote' }).click();
        // App should still show a quote after random selection
        await expect(page.locator('#quote a')).toBeVisible();
        await expect(page.locator('#citation')).not.toBeEmpty();
    });

    test('clicking outside the menu (overlay) closes it', async ({ page }) => {
        await page.locator('#menu-open-button').click();
        await expect(page.locator('#menu')).toBeVisible();
        await page.locator('#overlay').click();
        await expect(page.locator('#menu')).not.toBeVisible();
    });
});

// ── readability / CSS ─────────────────────────────────────────────────────────

test.describe('Readability', () => {
    test.beforeEach(async ({ page }) => {
        await waitForQuote(page);
        await openWorkModal(page);
    });

    test('modal body paragraphs have a readable font size (≥18px)', async ({ page }) => {
        const para = page.locator('#modal-body p').first();
        // Wait for at least one paragraph to appear (double-RAF + lazy network load)
        await expect(para).toBeVisible({ timeout: 15000 });
        const fontSize = await para.evaluate(el =>
            parseFloat(getComputedStyle(el).fontSize)
        );
        expect(fontSize).toBeGreaterThanOrEqual(18);
    });

    test('modal body paragraphs have comfortable line height (≥26px)', async ({ page }) => {
        const para = page.locator('#modal-body p').first();
        await expect(para).toBeVisible({ timeout: 15000 });
        const lineHeight = await para.evaluate(el =>
            parseFloat(getComputedStyle(el).lineHeight)
        );
        expect(lineHeight).toBeGreaterThanOrEqual(26);
    });

    test('modal content is wider than 600px on desktop', async ({ page }) => {
        // Only relevant on wider viewports
        const viewport = page.viewportSize();
        if (viewport && viewport.width < 700) test.skip();

        const modalWidth = await page.locator('#modal-content').evaluate(el =>
            el.getBoundingClientRect().width
        );
        expect(modalWidth).toBeGreaterThan(600);
    });

    test('fullscreen two-column layout is suppressed on narrow viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.locator('#modal-fullscreen').click();
        await expect(page.locator('#modal-content')).toHaveClass(/fullscreen/);

        const columnCount = await page.locator('#modal-body').evaluate(el =>
            getComputedStyle(el).columnCount
        );
        // On a narrow viewport the column-count override kicks in
        expect(columnCount).toBe('1');
    });
});

// ── visual snapshots ──────────────────────────────────────────────────────────
// These capture the UI at key breakpoints for manual review.
// On first run, use `npm run test:update-snapshots` to create the baselines.

test.describe('Visual snapshots', () => {
    test('quote page at desktop viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await waitForQuote(page);
        await expect(page).toHaveScreenshot('quote-desktop.png', { maxDiffPixels: 200 });
    });

    test('quote page at tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await waitForQuote(page);
        await expect(page).toHaveScreenshot('quote-tablet.png', { maxDiffPixels: 200 });
    });

    test('quote page at mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await waitForQuote(page);
        await expect(page).toHaveScreenshot('quote-mobile.png', { maxDiffPixels: 200 });
    });

    test('work modal at desktop viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await waitForQuote(page);
        await openWorkModal(page);
        await expect(page).toHaveScreenshot('modal-desktop.png', { maxDiffPixels: 200 });
    });

    test('work modal at mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await waitForQuote(page);
        await openWorkModal(page);
        await expect(page).toHaveScreenshot('modal-mobile.png', { maxDiffPixels: 200 });
    });
});
