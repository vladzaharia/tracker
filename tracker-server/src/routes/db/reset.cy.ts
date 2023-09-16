context('PUT /db/reset', () => {
	it('database is properly reset', () => {
		// Get current db info
		cy.request('GET', `${Cypress.env('API_URL')}/db`).then((infoResponse) => {
			const availableMigrations = infoResponse.body.migrations.available.length
			const appliedMigrations = infoResponse.body.migrations.applied.length

			cy.authorizedRequest('PUT', `${Cypress.env('API_URL')}/db/reset`).then((putResponse) => {
				expect(putResponse.status).to.eq(200)
				expect(putResponse.body.message).to.equal('Database reset successfully!')
			})

			cy.request('GET', `${Cypress.env('API_URL')}/db`).then((afterResponse) => {
				expect(afterResponse.status).to.eq(200)
				expect(afterResponse.body.migrations.current).to.not.exist
				expect(afterResponse.body.migrations.available.length).to.equal(availableMigrations + appliedMigrations)
				expect(afterResponse.body.migrations.applied).to.be.empty
			})
		})
	})

	it('database can be reset multiple times', () => {
		cy.authorizedRequest('PUT', `${Cypress.env('API_URL')}/db/reset`).then((putResponse) => {
			expect(putResponse.status).to.eq(200)
			expect(putResponse.body.message).to.equal('Database reset successfully!')
		})
		cy.authorizedRequest('PUT', `${Cypress.env('API_URL')}/db/reset`).then((secondResponse) => {
			expect(secondResponse.status).to.eq(200)
			expect(secondResponse.body.message).to.equal('Database reset successfully!')
		})
	})
})
