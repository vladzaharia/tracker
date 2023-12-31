import { defineConfig } from 'cypress'

export default defineConfig({
	e2e: {
		videosFolder: '../coverage/tracker-server/cypress/videos',
		screenshotsFolder: '../coverage/tracker-server/cypress/screenshots',
		specPattern: ['./src/**/*.cy.ts'],
	},
})
