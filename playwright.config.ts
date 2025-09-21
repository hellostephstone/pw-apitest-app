import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
	testDir: './tests',
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'html',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

	use: {
		trace: 'on-first-retry',
		extraHTTPHeaders: {
			Authorization: `Token ${process.env.ACCESS_TOKEN}`,
		},
	},

	projects: [
		{ name: 'setup', testMatch: 'auth.setup.ts' },
		{
			name: 'articleSetup',
			testMatch: 'newArticle.setup.ts',
			dependencies: ['setup'],
			teardown: 'articleCleanUp',
		},
		{
			name: 'articleCleanUp',
			testMatch: 'articleCleanUp.setup.ts',
		},
		{
			name: 'regression',
			use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json' },
			dependencies: ['setup'],
		},
		{
			name: 'likeCounter',
			testMatch: 'likesCounter.spec.ts',
			use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json' },
			dependencies: ['articleSetup'],
		},
	],
})
