# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stoic-reader.spec.js >> Visual snapshots >> quote page at mobile viewport
- Location: stoic-reader.spec.js:267:5

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  31759 pixels (ratio 0.11 of all image pixels) are different.

  Snapshot: quote-mobile.png

Call log:
  - Expect "toHaveScreenshot(quote-mobile.png)" with timeout 10000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 31759 pixels (ratio 0.11 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 31759 pixels (ratio 0.11 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - img "The Stoic Reader" [ref=e3]
    - generic [ref=e4] [cursor=pointer]: ✶
  - main [ref=e5]:
    - generic [ref=e6]:
      - paragraph [ref=e7]:
        - link "Yesterday you were with us. You might complain if I said \"yesterday\" merely. This is why I have added \"with us.\" For, so far as I am concerned, you are always with me. Certain friends had happened in, on whose account a somewhat brighter fire was laid, – not the kind that gene..." [ref=e8] [cursor=pointer]:
          - /url: "#"
      - paragraph [ref=e9]:
        - text: ~
        - link "Seneca" [ref=e10] [cursor=pointer]:
          - /url: "#"
        - text: ","
        - link "Letters from a Stoic" [ref=e11] [cursor=pointer]:
          - /url: "#"
        - text: ","
        - link "Letter 64" [ref=e12] [cursor=pointer]:
          - /url: "#"
        - text: ","
        - link "Verse 1" [ref=e13] [cursor=pointer]:
          - /url: "#"
  - contentinfo [ref=e14]:
    - generic [ref=e15]:
      - text: Copyright © 2026
      - link "The Aurelius Fund" [ref=e16] [cursor=pointer]:
        - /url: "#"
      - text: "| All Rights Reserved"
```

# Test source

```ts
  170 |         await page.locator('label[for="author-1-toggle"]').click();
  171 | 
  172 |         const link = page.locator('#menu .menu-author-item')
  173 |             .filter({ hasText: 'Marcus Aurelius' })
  174 |             .locator('a', { hasText: 'Meditations' });
  175 |         await link.click();
  176 | 
  177 |         await expect(page.locator('#modal')).toBeVisible();
  178 |         await expect(page.locator('#modal-title')).toHaveText(/meditations/i);
  179 |         // Meditations starts with Book I
  180 |         await expect(page.locator('#modal-body')).toContainText('Book I', { timeout: 15000 });
  181 |     });
  182 | 
  183 |     test('clicking Random Quote keeps the app functional', async ({ page }) => {
  184 |         await page.locator('#menu-open-button').click();
  185 |         await page.locator('#menu a', { hasText: 'Random Quote' }).click();
  186 |         // App should still show a quote after random selection
  187 |         await expect(page.locator('#quote a')).toBeVisible();
  188 |         await expect(page.locator('#citation')).not.toBeEmpty();
  189 |     });
  190 | 
  191 |     test('clicking outside the menu (overlay) closes it', async ({ page }) => {
  192 |         await page.locator('#menu-open-button').click();
  193 |         await expect(page.locator('#menu')).toBeVisible();
  194 |         await page.locator('#overlay').click();
  195 |         await expect(page.locator('#menu')).not.toBeVisible();
  196 |     });
  197 | });
  198 | 
  199 | // ── readability / CSS ─────────────────────────────────────────────────────────
  200 | 
  201 | test.describe('Readability', () => {
  202 |     test.beforeEach(async ({ page }) => {
  203 |         await waitForQuote(page);
  204 |         await openWorkModal(page);
  205 |     });
  206 | 
  207 |     test('modal body paragraphs have a readable font size (≥18px)', async ({ page }) => {
  208 |         const para = page.locator('#modal-body p').first();
  209 |         // Wait for at least one paragraph to appear (double-RAF + lazy network load)
  210 |         await expect(para).toBeVisible({ timeout: 15000 });
  211 |         const fontSize = await para.evaluate(el =>
  212 |             parseFloat(getComputedStyle(el).fontSize)
  213 |         );
  214 |         expect(fontSize).toBeGreaterThanOrEqual(18);
  215 |     });
  216 | 
  217 |     test('modal body paragraphs have comfortable line height (≥26px)', async ({ page }) => {
  218 |         const para = page.locator('#modal-body p').first();
  219 |         await expect(para).toBeVisible({ timeout: 15000 });
  220 |         const lineHeight = await para.evaluate(el =>
  221 |             parseFloat(getComputedStyle(el).lineHeight)
  222 |         );
  223 |         expect(lineHeight).toBeGreaterThanOrEqual(26);
  224 |     });
  225 | 
  226 |     test('modal content is wider than 600px on desktop', async ({ page }) => {
  227 |         // Only relevant on wider viewports
  228 |         const viewport = page.viewportSize();
  229 |         if (viewport && viewport.width < 700) test.skip();
  230 | 
  231 |         const modalWidth = await page.locator('#modal-content').evaluate(el =>
  232 |             el.getBoundingClientRect().width
  233 |         );
  234 |         expect(modalWidth).toBeGreaterThan(600);
  235 |     });
  236 | 
  237 |     test('fullscreen two-column layout is suppressed on narrow viewport', async ({ page }) => {
  238 |         await page.setViewportSize({ width: 375, height: 812 });
  239 |         await page.locator('#modal-fullscreen').click();
  240 |         await expect(page.locator('#modal-content')).toHaveClass(/fullscreen/);
  241 | 
  242 |         const columnCount = await page.locator('#modal-body').evaluate(el =>
  243 |             getComputedStyle(el).columnCount
  244 |         );
  245 |         // On a narrow viewport the column-count override kicks in
  246 |         expect(columnCount).toBe('1');
  247 |     });
  248 | });
  249 | 
  250 | // ── visual snapshots ──────────────────────────────────────────────────────────
  251 | // These capture the UI at key breakpoints for manual review.
  252 | // On first run, use `npm run test:update-snapshots` to create the baselines.
  253 | 
  254 | test.describe('Visual snapshots', () => {
  255 |     test('quote page at desktop viewport', async ({ page }) => {
  256 |         await page.setViewportSize({ width: 1440, height: 900 });
  257 |         await waitForQuote(page);
  258 |         await expect(page).toHaveScreenshot('quote-desktop.png', { maxDiffPixels: 200 });
  259 |     });
  260 | 
  261 |     test('quote page at tablet viewport', async ({ page }) => {
  262 |         await page.setViewportSize({ width: 768, height: 1024 });
  263 |         await waitForQuote(page);
  264 |         await expect(page).toHaveScreenshot('quote-tablet.png', { maxDiffPixels: 200 });
  265 |     });
  266 | 
  267 |     test('quote page at mobile viewport', async ({ page }) => {
  268 |         await page.setViewportSize({ width: 375, height: 812 });
  269 |         await waitForQuote(page);
> 270 |         await expect(page).toHaveScreenshot('quote-mobile.png', { maxDiffPixels: 200 });
      |                            ^ Error: expect(page).toHaveScreenshot(expected) failed
  271 |     });
  272 | 
  273 |     test('work modal at desktop viewport', async ({ page }) => {
  274 |         await page.setViewportSize({ width: 1440, height: 900 });
  275 |         await waitForQuote(page);
  276 |         await openWorkModal(page);
  277 |         await expect(page).toHaveScreenshot('modal-desktop.png', { maxDiffPixels: 200 });
  278 |     });
  279 | 
  280 |     test('work modal at mobile viewport', async ({ page }) => {
  281 |         await page.setViewportSize({ width: 375, height: 812 });
  282 |         await waitForQuote(page);
  283 |         await openWorkModal(page);
  284 |         await expect(page).toHaveScreenshot('modal-mobile.png', { maxDiffPixels: 200 });
  285 |     });
  286 | });
  287 | 
```