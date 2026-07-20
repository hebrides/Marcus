const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
    testDir: '.',
    outputDir: '/tmp/stoic-reader-playwright-results',
    timeout: 30000,
    expect: {
        timeout: 10000,
    },
    // Run all tests in parallel; they are independent of each other
    fullyParallel: true,
    // Fail the build on CI if any test.only slipped in
    forbidOnly: !!process.env.CI,
    // Retry once on CI to reduce flakiness
    retries: process.env.CI ? 1 : 0,
    reporter: 'list',

    use: {
        baseURL: 'http://localhost:3000',
        // Collect traces on first retry so failures are debuggable
        trace: 'on-first-retry',
    },

    // Serve the web/ directory via Python's built-in HTTP server.
    // Using Python avoids adding a Node.js server dependency.
    webServer: {
        command: `python3 -m http.server 3000 --directory ${path.join(__dirname, '..')}`,
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 10000,
    },

    // Test in Chromium only by default for speed; add Firefox/WebKit as desired.
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'mobile-safari',
            use: { ...devices['iPhone 13'] },
        },
        {
            name: 'desktop-safari',
            use: { ...devices['Desktop Safari'] },
        },
    ],
});
