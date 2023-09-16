import { defineConfig } from 'cypress'

export default defineConfig({
	projectId: '5ybqam',
	e2e: {
		retries: {
			runMode: 3,
			openMode: 0
		},
		videosFolder: '../coverage/tracker-server/cypress/videos',
		screenshotsFolder: '../coverage/tracker-server/cypress/screenshots',
		specPattern: ['./src/**/*.cy.ts'],
	},
})
