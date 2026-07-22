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

async function openSettings(page) {
    if (await page.locator('#modal').isVisible()) {
        await page.locator('#modal-close').click();
    }
    await page.locator('#menu-open-button').click();
    await page.locator('#settings-link').click();
}

// ── smoke tests ───────────────────────────────────────────────────────────────

test.describe('Smoke', () => {
    test('page loads and shows a quote with citation', async ({ page }) => {
        await waitForQuote(page);
        await expect(page.locator('#quote a')).not.toBeEmpty();
        await expect(page.locator('#citation')).not.toBeEmpty();
    });

    test('shows the saved quote preview before quote data finishes loading', async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.setItem('stoic-reader-startup-quote', JSON.stringify({
                quote: 'A prepared thought.',
                citation: 'Marcus Aurelius, Meditations, 1.1'
            }));
        });
        await page.route('**/data-all-quotes.json', async route => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await route.continue();
        });
        await page.goto('/');

        await expect(page.locator('#quote')).toHaveText('A prepared thought.');
        await expect(page.locator('#citation')).toHaveText('Marcus Aurelius, Meditations, 1.1');
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
        await page.evaluate(() => {
            appData.quotes.allQuotes = [{
                workId: '4',
                location: '19.1',
                quote: 'A deep quote before opening the work title.'
            }];
            showNewQuote('random');
        });
        await page.locator('#quoteLink').click();
        await expect(page.locator('#modal-body [id="19.1"]')).toBeAttached({ timeout: 15000 });
        await page.locator('#modal-close').click();

        await page.locator('#workLink label[for="modal-toggle"]').click();
        await expect(page.locator('#modal-body [id="1"]')).toBeAttached({ timeout: 15000 });
        await expect(page.locator('#modal-body')).toHaveAttribute('data-reader-location', '1');
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

    test('a quote deep link restores its target in an already-open work', async ({ page }) => {
        await page.evaluate(() => openWork('2', '58.21'));
        await expect(page.locator('#modal-body [id="58.21"]')).toBeAttached({ timeout: 15000 });

        await page.evaluate(() => {
            appData.quotes.allQuotes = [{
                workId: '2',
                location: '99.12',
                quote: 'A later passage in an already-open book.'
            }];
            showNewQuote('random');
            document.getElementById('quoteLink').click();
        });

        await expect(page.locator('#modal-body [id="99.12"]')).toBeAttached({ timeout: 15000 });
        await expect(page.locator('#modal-body')).toHaveAttribute('data-reader-location', '99.12');
        await expect.poll(() => page.evaluate(() => getBookTab('2').location)).toBe('99.12');
    });

    test('quote emphasis persists until minimize and returns when reopening a minimized work', async ({ page }) => {
        await page.evaluate(() => {
            appData.quotes.allQuotes = [{
                workId: '4',
                location: '19.1',
                quote: 'A highlighted quote passage.'
            }];
            showNewQuote('random');
        });
        await page.locator('#quoteLink').click();
        await expect(page.locator('#modal-body [id="19.1"]')).toHaveClass(/passage-highlight/, { timeout: 15000 });
        await page.waitForTimeout(3800);
        await expect(page.locator('#modal-body [id="19.1"]')).toHaveClass(/passage-highlight/);

        await page.locator('#modal-close').click();
        await expect(page.locator('#modal-body [id="19.1"]')).not.toHaveClass(/passage-highlight/);

        await page.locator('#quoteLink').click();
        await expect(page.locator('#modal-body [id="19.1"]')).toHaveClass(/passage-highlight/, { timeout: 15000 });
    });

    test('marks an open-book tab when its work data fails to load', async ({ page }) => {
        await page.route(/\/stoics\/.*\.json$/, route => route.abort('failed'));

        await page.locator('#quoteLink').click();

        await expect(page.locator('.reader-error')).toBeVisible({ timeout: 15000 });
        await page.locator('#modal-close').click();
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

    test('close button minimizes the active book tab', async ({ page }) => {
        await page.locator('#modal-close').click();
        await expect(page.locator('#modal')).not.toBeVisible();
        const savedState = await page.evaluate(() =>
            JSON.parse(localStorage.getItem('stoic-reader-state'))
        );
        expect(savedState.openBooks).toHaveLength(1);
    });

    test('clicking the overlay dismisses the modal', async ({ page }) => {
        // The overlay sits behind the modal content (z-index 50 vs 51).  Click at the
        // top-left corner of the viewport where the overlay is exposed and not covered
        // by the modal-content box.
        await page.mouse.click(10, 10);
        await expect(page.locator('#modal')).not.toBeVisible();
        await expect(page.locator('#book-tab-dock')).toBeVisible();
    });

    test('close button keeps the book available in the open-books dock', async ({ page }) => {
        await page.mouse.click(10, 10);
        await expect(page.locator('#modal')).not.toBeVisible();
        await expect(page.locator('#book-tab-dock')).toBeVisible();
        await expect(page.locator('.book-tab')).toHaveCount(1);
        await expect(page.locator('.book-tab')).toContainText(' - ');
        await expect(page.locator('.book-tab')).toHaveClass(/is-active/);
    });

    test('book tabs sit flush above the footer and reopen their book', async ({ page }) => {
        await page.mouse.click(10, 10);
        const geometry = await page.evaluate(() => {
            const tab = document.querySelector('.book-tab').getBoundingClientRect();
            const footer = document.querySelector('footer').getBoundingClientRect();
            return Math.abs(tab.bottom - footer.top);
        });
        expect(geometry).toBeLessThanOrEqual(1);

        await page.locator('.book-tab-open').click();
        await expect(page.locator('#modal')).toBeVisible();
    });

    test('reopens a minimized book from its warm rendered view', async ({ page }) => {
        await page.locator('.reader-viewport').evaluate(element => {
            element.dataset.warmViewProbe = 'retained';
        });
        await page.mouse.click(10, 10);
        await page.locator('.book-tab-open').click();

        await expect(page.locator('.reader-viewport')).toHaveAttribute('data-warm-view-probe', 'retained');
    });

    test('tabs keep their close control visible and underline their text on hover', async ({ page }) => {
        await page.mouse.click(10, 10);
        const tab = page.locator('.book-tab.is-active');
        const openButton = tab.locator('.book-tab-open');
        const closeButton = tab.locator('.book-tab-close');

        await expect(closeButton).toBeVisible();
        await tab.hover();
        await expect(openButton).toHaveCSS('text-decoration-line', 'underline');

        const geometry = await tab.evaluate(element => {
            const tabRect = element.getBoundingClientRect();
            const closeRect = element.querySelector('.book-tab-close').getBoundingClientRect();
            return {
                closeFits: closeRect.left >= tabRect.left && closeRect.right <= tabRect.right,
                tabWidth: tabRect.width,
                afterContent: getComputedStyle(element, '::after').content
            };
        });
        expect(geometry.closeFits).toBe(true);
        expect(geometry.tabWidth).toBeGreaterThan(0);
        expect(geometry.afterContent).toBe('none');
    });

    test('book tab close control removes only that open tab', async ({ page }) => {
        await page.mouse.click(10, 10);
        await page.locator('.book-tab-close').click();
        await expect(page.locator('#book-tab-dock')).toBeHidden();
        await expect(page.locator('.book-tab')).toHaveCount(0);
    });

    test('a closed book tab does not return after refresh', async ({ page }) => {
        await page.mouse.click(10, 10);
        await page.locator('.book-tab-close').click();
        await page.reload();

        await expect(page.locator('#quote a')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('#book-tab-dock')).toBeHidden();
        await expect(page.locator('.book-tab')).toHaveCount(0);
    });

    test('book tab updates when the reader location is remembered', async ({ page }) => {
        const location = await page.locator('#modal-body [id]').last().evaluate(element => {
            rememberBookLocation(appState.currentWork.id, element.id);
            return element.id;
        });
        await expect.poll(() => page.locator('.book-tab').innerText())
            .toContain(location.split('.').at(-1));
    });

    test('minimized books remain available after a reload', async ({ page }) => {
        await page.mouse.click(10, 10);
        await page.reload();
        await expect(page.locator('#quote a')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('#book-tab-dock')).toBeVisible();
        await expect(page.locator('.book-tab')).toHaveCount(1);
    });

    test('discards legacy saved tabs during reader-state migration', async ({ page }) => {
        await page.evaluate(() => {
            localStorage.setItem('stoic-reader-state', JSON.stringify({
                openBooks: [{ workId: '8', location: '1', minimized: true, error: false }],
                lastLocations: { 8: '1' }
            }));
        });
        await page.reload();

        await expect(page.locator('#quote a')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('#book-tab-dock')).toBeHidden();
        expect(await page.evaluate(() => localStorage.getItem('stoic-reader-state'))).toBeNull();
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

    test('opening a saved bookmark emphasizes its passage without changing the quote surface', async ({ page }) => {
        const quoteStyle = await page.locator('#quote > a').evaluate(element => {
            const style = getComputedStyle(element);
            return {
                backgroundColor: style.backgroundColor,
                textDecorationLine: style.textDecorationLine
            };
        });
        expect(quoteStyle.backgroundColor).toBe('rgba(0, 0, 0, 0)');
        expect(quoteStyle.textDecorationLine).toBe('none');

        await page.locator('#modal-bookmark').click();
        await openSettings(page);
        await page.locator('.bookmark-link').click();

        const passageStyle = await page.locator('.passage-highlight').evaluate(element => {
            const style = getComputedStyle(element);
            return {
                backgroundColor: style.backgroundColor,
                color: style.color,
                textDecorationLine: style.textDecorationLine
            };
        });

        expect(passageStyle.color).toBe('rgb(255, 255, 255)');
        expect(passageStyle.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
        expect(passageStyle.textDecorationLine).toContain('underline');
    });

    test('fullscreen toggle adds fullscreen class on first click', async ({ page }) => {
        const content = page.locator('#modal-content');
        await expect(content).not.toHaveClass(/fullscreen/);
        await page.locator('#modal-fullscreen').click();
        await expect(content).toHaveClass(/fullscreen/);
    });

    test('fullscreen reader renders clipped two-column spreads with working page controls', async ({ page }) => {
        await expect(page.locator('#reader-page-next')).toBeHidden();
        await page.evaluate(() => openWork('1', '5.1'));
        await expect(page.locator('#modal-body [id]')).not.toHaveCount(0);
        await page.locator('#modal-fullscreen').click();

        const isTwoColumnViewport = await page.evaluate(() => window.innerWidth > 900);
        if (!isTwoColumnViewport) {
            await expect(page.locator('.reader-flow')).toHaveCSS('column-count', '1');
            await expect(page.locator('#reader-page-next')).toBeHidden();
            return;
        }

        await expect(page.locator('.reader-flow')).toHaveCSS('column-count', 'auto');
        await expect(page.locator('#reader-page-next')).toBeVisible();
        await expect.poll(() => page.locator('.reader-flow').evaluate(element =>
            element.style.getPropertyValue('--reader-column-width')
        )).not.toBe('');

        const dimensions = await page.locator('.reader-flow').evaluate(element => ({
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth
        }));
        expect(dimensions.scrollWidth).toBeGreaterThan(dimensions.clientWidth);
        await expect(page.locator('.reader-spread-clip')).toHaveCSS('overflow', 'hidden');
        const initialScroll = await page.locator('.reader-flow').evaluate(element => element.scrollLeft);
        await page.locator('#reader-page-next').click();
        await expect.poll(() => page.locator('.reader-flow').evaluate(element => element.scrollLeft))
            .toBeGreaterThan(initialScroll);
    });

    test('Fragments animates progress during page turns and completes at the final spread', async ({ page }) => {
        await page.evaluate(() => {
            closeBookTab('10');
            openWork('10', '1');
        });
        await expect(page.locator('#modal-data-loading')).toBeHidden({ timeout: 15000 });
        await expect(page.locator('#reader-progress-indicator')).toHaveCSS('width', '0px');
        await page.locator('#modal-fullscreen').click();
        if (await page.evaluate(() => window.innerWidth <= 900)) return;

        await expect(page.locator('#reader-page-next')).toBeEnabled({ timeout: 15000 });
        await expect(page.locator('#reader-progress-indicator')).toHaveCSS('width', '0px');
        const sampledProgress = await page.evaluate(async () => {
            const indicator = document.getElementById('reader-progress-indicator');
            const next = document.getElementById('reader-page-next');
            const values = [parseFloat(indicator.style.width)];
            next.click();
            for (let frame = 0; frame < 12; frame += 1) {
                await new Promise(resolve => requestAnimationFrame(resolve));
                values.push(parseFloat(indicator.style.width));
            }
            return values;
        });
        expect(Math.max(...sampledProgress)).toBeGreaterThan(sampledProgress[0]);
        sampledProgress.slice(1).forEach((value, index) => {
            expect(value).toBeGreaterThanOrEqual(sampledProgress[index]);
        });

        const finalProgress = await page.evaluate(async () => {
            const indicator = document.getElementById('reader-progress-indicator');
            const next = document.getElementById('reader-page-next');
            for (let turn = 0; turn < 16; turn += 1) {
                next.click();
                await new Promise(resolve => setTimeout(resolve, 450));
            }
            return parseFloat(indicator.style.width);
        });
        expect(finalProgress).toBe(100);
    });

    test('deep targets begin in the left fullscreen column', async ({ page }) => {
        await page.evaluate(() => {
            closeBookTab('4');
            openWork('4', '19.1');
        });
        await expect(page.locator('#modal-data-loading')).toBeHidden({ timeout: 15000 });
        await page.locator('#modal-fullscreen').click();
        if (await page.evaluate(() => window.innerWidth <= 900)) return;

        await expect(page.locator('#reader-page-next')).toBeEnabled({ timeout: 15000 });
        const placement = await page.evaluate(() => {
            const anchor = document.querySelector('#modal-body [id="19.1"]').getBoundingClientRect();
            const flow = document.querySelector('.reader-flow').getBoundingClientRect();
            return { anchorLeft: anchor.left, flowLeft: flow.left, flowWidth: flow.width };
        });
        expect(placement.anchorLeft).toBeGreaterThanOrEqual(placement.flowLeft);
        expect(placement.anchorLeft).toBeLessThan(placement.flowLeft + placement.flowWidth / 2);
    });

    test('reader progress retains its semantic extent across reader modes', async ({ page }) => {
        await expect(page.locator('#reader-progress')).toBeVisible();
        const oneColumnWidth = await page.locator('#reader-progress-indicator').evaluate(element =>
            parseFloat(element.style.width)
        );

        await page.locator('#modal-fullscreen').click();
        if (await page.evaluate(() => window.innerWidth > 900)) {
            await expect(page.locator('#reader-page-next')).toBeEnabled({ timeout: 15000 });
            const twoColumnWidth = await page.locator('#reader-progress-indicator').evaluate(element =>
                parseFloat(element.style.width)
            );
            expect(Math.abs(twoColumnWidth - oneColumnWidth)).toBeLessThan(1);
        }
    });

    test('reader progress uses generated word-weighted semantic timelines', async ({ page }) => {
        await page.evaluate(() => openWork('4', '56.2'));
        await expect(page.locator('#modal-data-loading')).toBeHidden({ timeout: 15000 });

        const progress = await page.evaluate(() => {
            const timeline = appState.readerChunks.get('4').timeline;
            const viewport = document.querySelector('.reader-viewport').getBoundingClientRect();
            const pair = getReaderProgressAnchorPair(
                document.querySelector('.reader-flow'),
                timeline,
                viewport.top + viewport.height / 2
            );
            const pairRatio = (viewport.top + viewport.height / 2 - pair.previous.top) /
                (pair.next.top - pair.previous.top);
            return {
                indicatorLeft: parseFloat(document.getElementById('reader-progress-indicator').style.left),
                indicatorWidth: parseFloat(document.getElementById('reader-progress-indicator').style.width),
                interpolatedPosition: (timeline.wordOffsets[pair.previous.index] +
                    pairRatio * (timeline.wordOffsets[pair.next.index] - timeline.wordOffsets[pair.previous.index])) /
                    timeline.totalWords * 100,
                ordinalPosition: pair.previous.index / (timeline.ids.length - 1) * 100
            };
        });

        expect(progress.indicatorLeft).toBe(0);
        expect(progress.indicatorWidth).toBeCloseTo(progress.interpolatedPosition, 1);
        expect(progress.interpolatedPosition).not.toBeCloseTo(progress.ordinalPosition, 1);
    });

    test('rapidly switching books does not let an older layout enable the current spread', async ({ page }) => {
        await page.locator('#modal-fullscreen').click();
        await page.evaluate(() => {
            openWork('3', '1');
            openWork('8', '1');
        });

        await expect(page.locator('#modal-title')).toHaveText('Tusculan Disputations');
        await expect(page.locator('#modal-data-loading')).toBeHidden({ timeout: 15000 });
        await expect(page.locator('.reader-flow')).toContainText('Tusculan', { timeout: 15000 });

        if (await page.evaluate(() => window.innerWidth > 900)) {
            await expect(page.locator('#reader-page-next')).toBeEnabled();
        }
    });

    test('renders an incremental reader window instead of the entire work', async ({ page }) => {
        await page.evaluate(() => openWork('1', '1'));
        await expect(page.locator('.reader-flow')).toBeVisible({ timeout: 15000 });

        const sizes = await page.evaluate(() => {
            const work = appData.works.find(item => item.id === '1');
            const sourceLength = work.data[1].join('').length;
            const renderedLength = document.querySelector('.reader-flow').innerHTML.length;
            const beforeAppend = renderedLength;
            const appended = appendNextReaderChunk('1');
            const afterAppend = document.querySelector('.reader-flow').innerHTML.length;
            return { sourceLength, renderedLength, beforeAppend, appended, afterAppend };
        });

        expect(sizes.renderedLength).toBeLessThan(sizes.sourceLength);
        expect(sizes.appended).toBe(true);
        expect(sizes.afterAppend).toBeGreaterThan(sizes.beforeAppend);
    });

    test('loads earlier chunks while scrolling backward from a deep link', async ({ page }) => {
        await page.evaluate(() => {
            closeBookTab('2');
            openWork('2', '99.12');
        });
        await expect(page.locator('#modal-data-loading')).toBeHidden({ timeout: 15000 });
        await page.waitForTimeout(550);

        const result = await page.locator('.reader-viewport').evaluate(viewport => {
            const readerData = appState.readerChunks.get('2');
            const previousChunkIndex = readerData.previousChunkIndex;
            viewport.scrollTop = 0;
            viewport.dispatchEvent(new Event('scroll'));
            return {
                previousChunkIndex,
                updatedPreviousChunkIndex: readerData.previousChunkIndex,
                scrollTop: viewport.scrollTop
            };
        });

        expect(result.previousChunkIndex).toBeGreaterThanOrEqual(0);
        expect(result.updatedPreviousChunkIndex).toBe(result.previousChunkIndex - 1);
        expect(result.scrollTop).toBeGreaterThan(0);
    });

    test('reader progress does not move backward during forward scrolling', async ({ page }) => {
        await page.evaluate(() => openWork('2', '99.12'));
        await expect(page.locator('#modal-data-loading')).toBeHidden({ timeout: 15000 });
        await page.waitForTimeout(550);

        const widths = await page.locator('.reader-viewport').evaluate(async viewport => {
            const values = [];
            for (let step = 0; step < 8; step += 1) {
                viewport.scrollTop += 160;
                viewport.dispatchEvent(new Event('scroll'));
                await new Promise(resolve => requestAnimationFrame(resolve));
                values.push(parseFloat(document.getElementById('reader-progress-indicator').style.width));
            }
            return values;
        });

        widths.slice(1).forEach((width, index) => {
            expect(width).toBeGreaterThanOrEqual(widths[index]);
        });
    });

    test('reader progress fills completely at the end of a work', async ({ page }) => {
        await page.evaluate(() => openWork('4', '1'));
        await expect(page.locator('#modal-data-loading')).toBeHidden({ timeout: 15000 });
        await page.waitForTimeout(550);

        const progress = await page.locator('.reader-viewport').evaluate(async viewport => {
            const readerData = appState.readerChunks.get('4');
            while (readerData.nextChunkIndex < readerData.chunks.length) {
                viewport.scrollTop = viewport.scrollHeight;
                viewport.dispatchEvent(new Event('scroll'));
                await new Promise(resolve => requestAnimationFrame(resolve));
            }
            viewport.scrollTop = viewport.scrollHeight;
            viewport.dispatchEvent(new Event('scroll'));
            return parseFloat(document.getElementById('reader-progress-indicator').style.width);
        });

        expect(progress).toBe(100);
    });

    test('deep-linked Letters from a Stoic enables spread controls', async ({ page }) => {
        await page.evaluate(() => openWork('2', '58.21', true));
        await expect(page.locator('#modal-title')).toHaveText('Letters from a Stoic');
        await expect(page.locator('#modal-data-loading')).toBeHidden({ timeout: 15000 });
        await expect(page.locator('.reader-flow')).toContainText('The third class is made up');
        await page.locator('#modal-fullscreen').click();

        if (await page.evaluate(() => window.innerWidth > 900)) {
            await expect(page.locator('#reader-page-next')).toBeEnabled({ timeout: 15000 });
            const initialScroll = await page.locator('.reader-flow').evaluate(element => element.scrollLeft);
            const dimensions = await page.locator('.reader-flow').evaluate(element => ({
                clientWidth: element.clientWidth,
                scrollWidth: element.scrollWidth,
                textLength: element.textContent.length,
                chunkIndex: appState.readerChunks.get(appState.currentWork.id)?.nextChunkIndex
            }));
            expect(dimensions.scrollWidth).toBeGreaterThan(dimensions.clientWidth);
            await page.locator('#reader-page-next').click();
            await expect.poll(() => page.locator('.reader-flow').evaluate(element => element.scrollLeft))
                .toBeGreaterThan(initialScroll);
        }
    });

    test('quote-linked works enable spread controls', async ({ page }) => {
        await page.locator('#modal-close').click();
        for (const quote of [
            { workId: '2', location: '58.21', title: 'Letters from a Stoic', text: 'A deep-linked Letters passage.' },
            { workId: '3', location: '69.1', title: 'The Discourses', text: 'A deep-linked Discourses passage.' }
        ]) {
            await page.evaluate(currentQuote => {
                appData.quotes.allQuotes = [currentQuote];
                showNewQuote('random');
            }, { workId: quote.workId, location: quote.location, quote: quote.text });
            await page.locator('#quoteLink').click();
            await expect(page.locator('#modal-title')).toHaveText(quote.title);
            await expect(page.locator('#modal-data-loading')).toBeHidden({ timeout: 15000 });
            await page.locator('#modal-fullscreen').click();

            if (await page.evaluate(() => window.innerWidth > 900)) {
                await expect(page.locator('#reader-page-next')).toBeEnabled({ timeout: 15000 });
                const initialScroll = await page.locator('.reader-flow').evaluate(element => element.scrollLeft);
                await page.locator('#reader-page-next').click();
                await expect.poll(() => page.locator('.reader-flow').evaluate(element => element.scrollLeft))
                    .toBeGreaterThan(initialScroll);
            }

            await page.locator('#modal-close').click();
        }
    });

    test('fullscreen toggle removes fullscreen class on second click', async ({ page }) => {
        const content = page.locator('#modal-content');
        await page.locator('#modal-fullscreen').click();
        await expect(content).toHaveClass(/fullscreen/);
        await page.locator('#modal-fullscreen').click();
        await expect(content).not.toHaveClass(/fullscreen/);
    });

    test('minimized books restore their fullscreen reader state', async ({ page }) => {
        await page.locator('#modal-fullscreen').click();
        await expect(page.locator('#modal-content')).toHaveClass(/fullscreen/);
        await page.locator('#modal-close').click();
        await page.locator('.book-tab-open').click();

        await expect(page.locator('#modal-content')).toHaveClass(/fullscreen/);
    });

    test('reopening a paginated tab preserves its semantic anchor', async ({ page }) => {
        await page.evaluate(() => openWork('4', '19.1'));
        await expect(page.locator('#modal-data-loading')).toBeHidden({ timeout: 15000 });
        await page.locator('#modal-fullscreen').click();
        await expect(page.locator('#reader-page-next')).toBeEnabled({ timeout: 15000 });
        const goldenTab = page.locator('.book-tab-open').filter({ hasText: 'The Golden Sayings' });
        const savedLocation = await page.evaluate(() => getBookTab('4').location);
        await page.locator('#modal-fullscreen').click();
        await page.locator('#modal-fullscreen').click();
        await expect(page.locator('#reader-page-next')).toBeEnabled({ timeout: 15000 });
        await expect(page.locator('#modal-body [id="19.1"]')).toBeAttached({ timeout: 15000 });
        const fullscreenAnchor = await page.evaluate(() => {
            const anchor = document.querySelector('#modal-body [id="19.1"]').getBoundingClientRect();
            const flow = document.querySelector('.reader-flow').getBoundingClientRect();
            return { anchorLeft: anchor.left, flowLeft: flow.left, flowRight: flow.right };
        });
        expect(fullscreenAnchor.anchorLeft).toBeGreaterThanOrEqual(fullscreenAnchor.flowLeft);
        expect(fullscreenAnchor.anchorLeft).toBeLessThan(fullscreenAnchor.flowRight);
        await page.locator('#modal-fullscreen').click();
        await expect.poll(() => page.evaluate(() => getBookTab('4').location)).toBe(savedLocation);
        await page.locator('#modal-close').click();
        await goldenTab.click();

        await expect.poll(() => page.evaluate(() => getBookTab('4').location)).toBe(savedLocation);
        await expect(page.locator('#modal-body')).toHaveAttribute('data-reader-location', savedLocation);
    });

    test('leaving two-column mode retains the current semantic anchor', async ({ page }) => {
        await page.evaluate(() => openWork('4', '19.1'));
        await expect(page.locator('#modal-data-loading')).toBeHidden({ timeout: 15000 });
        await page.locator('#modal-fullscreen').click();
        await page.locator('#modal-fullscreen').click();

        const anchorPosition = await page.evaluate(() => {
            const anchor = document.querySelector('#modal-body [id="19.1"]');
            const viewport = document.querySelector('.reader-viewport').getBoundingClientRect();
            const bounds = anchor.getBoundingClientRect();
            return { top: bounds.top, bottom: bounds.bottom, viewportTop: viewport.top, viewportBottom: viewport.bottom };
        });
        expect(anchorPosition.bottom).toBeGreaterThan(anchorPosition.viewportTop);
        expect(anchorPosition.top).toBeLessThan(anchorPosition.viewportBottom);
    });

    test('restored single-column views continue updating their semantic anchor', async ({ page }) => {
        await page.evaluate(() => openWork('1', '1'));
        await expect(page.locator('#modal-data-loading')).toBeHidden({ timeout: 15000 });
        await page.waitForTimeout(550);
        const viewport = page.locator('.reader-viewport');

        await viewport.evaluate(element => {
            element.scrollTop = element.scrollHeight * .45;
        });
        await expect.poll(() => page.evaluate(() => getBookTab('1').location)).not.toBe('1');
        const firstLocation = await page.evaluate(() => getBookTab('1').location);

        await page.locator('#modal-close').click();
        await page.locator('.book-tab-open').filter({ hasText: 'Meditations' }).click();
        await page.waitForTimeout(550);
        await viewport.evaluate(element => {
            element.scrollTop = element.scrollHeight * .8;
        });

        await expect.poll(() => page.evaluate(() => getBookTab('1').location)).not.toBe(firstLocation);
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
        await openSettings(page);

        await expect(page.locator('#modal-title')).toHaveText('Settings');
        await expect(page.locator('#modal-fullscreen')).toBeHidden();
        await expect(page.locator('#modal-reader-settings')).toHaveCount(0);
        await expect(page.locator('#modal-content')).not.toHaveClass(/fullscreen/);
    });

    test('persists the Day mode toggle across reloads', async ({ page }) => {
        await openSettings(page);
        await page.locator('#setting-day-mode').check();

        await expect(page.locator('body')).toHaveClass(/theme-day/);

        await page.reload();
        await expect(page.locator('#quote a')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('body')).toHaveClass(/theme-day/);
    });

    test('persists the Large text toggle across reloads', async ({ page }) => {
        await openSettings(page);
        await page.locator('#setting-large-text').check();

        await expect(page.locator('body')).toHaveClass(/reader-large/);

        await page.reload();
        await expect(page.locator('#quote a')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('body')).toHaveClass(/reader-large/);
    });

    test('persists the curated font choice across reloads', async ({ page }) => {
        await openSettings(page);
        await page.locator('#setting-font').selectOption('georgia');

        await expect(page.locator('body')).toHaveClass(/reader-font-georgia/);

        await page.reload();
        await expect(page.locator('#quote a')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('body')).toHaveClass(/reader-font-georgia/);
    });

    test('persists the letter-spacing choice across reloads', async ({ page }) => {
        await openSettings(page);
        await page.locator('#setting-spacing').selectOption('relaxed');

        await expect(page.locator('body')).toHaveClass(/reader-spacing-relaxed/);

        await page.reload();
        await expect(page.locator('#quote a')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('body')).toHaveClass(/reader-spacing-relaxed/);
    });

    test('keeps library scope and starter paths in Settings, not the main menu', async ({ page }) => {
        await page.locator('#modal-close').click();
        await page.locator('#menu-open-button').click();
        await expect(page.locator('#menu')).not.toContainText('Starter Paths');
        await expect(page.locator('#menu')).not.toContainText('Library Scope');
        await expect(page.locator('#menu')).not.toContainText('Core Stoic Canon');
        await page.locator('#settings-link').click();

        await expect(page.locator('#setting-extended-library')).toBeVisible();
        await expect(page.locator('#setting-chat-scope')).toBeVisible();
        await expect(page.locator('.starter-path-link')).toHaveCount(3);
    });

    test('Reset app confirms before clearing app state and reloading', async ({ page }) => {
        await openSettings(page);
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

    test('Reset app leaves data intact when confirmation is cancelled', async ({ page }) => {
        await openSettings(page);
        await page.locator('#setting-day-mode').check();
        page.once('dialog', dialog => dialog.dismiss());
        await page.locator('#reset-app').click();

        await expect(page.locator('#modal-title')).toHaveText('Settings');
        await expect(page).not.toHaveURL(/refresh=/);
        const settings = await page.evaluate(() =>
            JSON.parse(localStorage.getItem('stoic-reader-settings'))
        );
        expect(settings.theme).toBe('day');
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

    test('reader remains a vertical single-column view on narrow viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.locator('#modal-fullscreen').click();
        await expect(page.locator('#modal-content')).toHaveClass(/fullscreen/);

        const columns = await page.locator('.reader-flow').evaluate(el =>
            getComputedStyle(el).columnCount
        );
        expect(columns).toBe('1');
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
