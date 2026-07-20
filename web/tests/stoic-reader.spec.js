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
const { pathToFileURL } = require('url');
const path = require('path');

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
    await expect(page.locator('#modal-data-loading')).toBeHidden({ timeout: 15000 });
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

    test('reports a metadata load failure without leaving the page blank', async ({ page }) => {
        const errors = [];
        page.on('console', message => {
            if (message.type() === 'error') errors.push(message.text());
        });
        await page.route('**/data-meta.json', route => route.abort('failed'));

        await page.goto('/');

        await expect(page.locator('#quote')).toHaveText(
            'The impediment to action advances action. What stands in the way becomes the way.'
        );
        await expect(page.locator('#citation')).toContainText('Meditations 5.20');
        await expect(page.locator('#app-load-error')).toBeVisible();
        expect(errors).toContainEqual(
            expect.stringContaining('Stoic Reader could not load its library data.')
        );
    });

    test('explains how to run the app when opened with the file protocol', async ({ page }) => {
        const indexUrl = pathToFileURL(path.join(__dirname, '..', 'index.html')).href;

        await page.goto(indexUrl);

        await expect(page.locator('#quote')).toHaveText(
            'The impediment to action advances action. What stands in the way becomes the way.'
        );
        await expect(page.locator('#citation')).toContainText('python3 -m http.server 8000');
        await expect(page.locator('#app-load-error')).toBeVisible();
    });
});

// ── quote interaction ─────────────────────────────────────────────────────────

test.describe('Quote interaction', () => {
    test.beforeEach(async ({ page }) => waitForQuote(page));

    test('clicking the quote opens the work modal with content', async ({ page }) => {
        await page.locator('#quote a label[for="modal-toggle"]').click();
        await expect(page.locator('#modal-data-loading')).toBeVisible();
        await expect(page.locator('#modal-data-loading')).toBeHidden({ timeout: 15000 });
        await expect(page.locator('#modal-title')).not.toBeEmpty();
        await expect(page.locator('#modal-body')).not.toBeEmpty();
        await expect(page.locator('#modal-body')).toHaveClass(/is-visible/);
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

    test('a quote reopens its own book after another book was viewed', async ({ page }) => {
        const quoteWork = await page.locator('#workLink').innerText();
        await page.locator('#menu-open-button').click();
        const otherWork = page.locator('#menu .menu-author-item a').filter({
            hasNotText: quoteWork
        }).first();
        await otherWork.locator('xpath=../../preceding-sibling::label[1]').click();
        await otherWork.click();
        await expect(page.locator('#modal-title')).not.toHaveText(quoteWork);

        await page.locator('#modal-close').click();
        await page.locator('#quoteLink').click();

        await expect(page.locator('#modal-title')).toHaveText(quoteWork);
    });

    test('marks an open-book tab when its work data fails to load', async ({ page }) => {
        await page.route(/\/stoics\/.*\.json$/, route => route.abort('failed'));

        await page.locator('#quoteLink').click();

        await expect(page.locator('.reader-error')).toBeVisible({ timeout: 15000 });
        await page.locator('#modal-minimize').click();
        await expect(page.locator('.book-tab.has-error')).toHaveCount(1);
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
        const savedState = await page.evaluate(() =>
            JSON.parse(localStorage.getItem('stoic-reader-state'))
        );
        expect(savedState.openBooks).toEqual([]);
        expect(Object.values(savedState.lastLocations)).toHaveLength(1);
    });

    test('clicking the overlay dismisses the modal', async ({ page }) => {
        // The overlay sits behind the modal content (z-index 50 vs 51).  Click at the
        // top-left corner of the viewport where the overlay is exposed and not covered
        // by the modal-content box.
        await page.mouse.click(10, 10);
        await expect(page.locator('#modal')).not.toBeVisible();
        await expect(page.locator('#book-tab-dock')).toBeVisible();
    });

    test('minimize button keeps the book available in the open-books dock', async ({ page }) => {
        await page.locator('#modal-minimize').click();
        await expect(page.locator('#modal')).not.toBeVisible();
        await expect(page.locator('#book-tab-dock')).toBeVisible();
        await expect(page.locator('.book-tab')).toHaveCount(1);
    });

    test('minimized books remain available after a reload', async ({ page }) => {
        await page.locator('#modal-minimize').click();
        await page.reload();
        await expect(page.locator('#quote a')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('#book-tab-dock')).toBeVisible();
        await expect(page.locator('.book-tab')).toHaveCount(1);
    });

    test('bookmark control saves and removes the active reading location', async ({ page }) => {
        const bookmark = page.locator('#modal-bookmark');
        await bookmark.click();
        await expect(bookmark).toHaveClass(/is-bookmarked/);
        let bookmarks = await page.evaluate(() =>
            JSON.parse(localStorage.getItem('stoic-reader-bookmarks'))
        );
        expect(bookmarks).toHaveLength(1);

        await bookmark.click();
        await expect(bookmark).not.toHaveClass(/is-bookmarked/);
        bookmarks = await page.evaluate(() =>
            JSON.parse(localStorage.getItem('stoic-reader-bookmarks'))
        );
        expect(bookmarks).toHaveLength(0);
    });

    test('fullscreen toggle adds fullscreen class on first click', async ({ page }) => {
        const content = page.locator('#modal-content');
        await expect(content).not.toHaveClass(/fullscreen/);
        await page.locator('#modal-fullscreen').click();
        await expect(content).toHaveClass(/fullscreen/);
    });

    test('fullscreen reader renders a two-page spread and page edge advances it', async ({ page }) => {
        await page.locator('#modal-fullscreen').click();
        const pageWidth = await page.locator('.reader-page').first().evaluate(el =>
            el.getBoundingClientRect().width
        );
        const readerWidth = await page.locator('#modal-body').evaluate(el =>
            el.getBoundingClientRect().width
        );
        expect(pageWidth).toBeLessThanOrEqual(readerWidth / 2 + 1);

        await page.locator('#reader-page-next').click();
        await expect.poll(() => page.locator('#modal-body').evaluate(el => el.scrollLeft))
            .toBeGreaterThan(0);
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

// ── reader settings ──────────────────────────────────────────────────────────

test.describe('Reader settings', () => {
    test.beforeEach(async ({ page }) => {
        await waitForQuote(page);
        await openWorkModal(page);
    });

    test('opens as a single-page modal without reader-only controls', async ({ page }) => {
        await page.locator('#modal-reader-settings').click();

        await expect(page.locator('#modal-title')).toHaveText('Settings');
        await expect(page.locator('#modal-fullscreen')).toBeHidden();
        await expect(page.locator('#modal-minimize')).toBeHidden();
        await expect(page.locator('#modal-content')).not.toHaveClass(/fullscreen/);
    });

    test('persists the Day mode toggle across reloads', async ({ page }) => {
        await page.locator('#modal-reader-settings').click();
        await page.locator('#setting-day-mode').check();

        await expect(page.locator('body')).toHaveClass(/theme-day/);

        await page.reload();
        await expect(page.locator('#quote a')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('body')).toHaveClass(/theme-day/);
    });

    test('persists the Large text toggle across reloads', async ({ page }) => {
        await page.locator('#modal-reader-settings').click();
        await page.locator('#setting-large-text').check();

        await expect(page.locator('body')).toHaveClass(/reader-large/);

        await page.reload();
        await expect(page.locator('#quote a')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('body')).toHaveClass(/reader-large/);
    });

    test('persists the curated font choice across reloads', async ({ page }) => {
        await page.locator('#modal-reader-settings').click();
        await page.locator('#setting-font').selectOption('georgia');

        await expect(page.locator('body')).toHaveClass(/reader-font-georgia/);

        await page.reload();
        await expect(page.locator('#quote a')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('body')).toHaveClass(/reader-font-georgia/);
    });

    test('persists the letter-spacing choice across reloads', async ({ page }) => {
        await page.locator('#modal-reader-settings').click();
        await page.locator('#setting-spacing').selectOption('relaxed');

        await expect(page.locator('body')).toHaveClass(/reader-spacing-relaxed/);

        await page.reload();
        await expect(page.locator('#quote a')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('body')).toHaveClass(/reader-spacing-relaxed/);
    });

    test('Reset app confirms before clearing app state and reloading', async ({ page }) => {
        await page.locator('#modal-reader-settings').click();
        page.once('dialog', dialog => dialog.accept());
        await page.locator('#reset-app').click();

        await page.waitForURL(/refresh=/);
        await expect(page.locator('#quote a')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('#book-tab-dock')).toBeHidden();
        const bookmarks = await page.evaluate(() =>
            localStorage.getItem('stoic-reader-bookmarks')
        );
        expect(bookmarks).toBeNull();
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

    test('Settings menu opens the single-page reader settings modal', async ({ page }) => {
        await page.locator('#menu-open-button').click();
        await page.locator('#settings-link').click();
        await expect(page.locator('#modal-title')).toHaveText('Settings');
        await expect(page.locator('#modal-fullscreen')).toBeHidden();
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

    test('reader uses snapped horizontal pages on narrow viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.locator('#modal-fullscreen').click();
        await expect(page.locator('#modal-content')).toHaveClass(/fullscreen/);

        const scrollSnapType = await page.locator('#modal-body').evaluate(el =>
            getComputedStyle(el).scrollSnapType
        );
        expect(scrollSnapType).toContain('x');
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
