context('PUT /db/migrate', () => {
	it('database is properly migrated', () => {
		// Reset database
		cy.resetDatabase()

		// Get current db info
		cy.request('GET', `${Cypress.env('API_URL')}/db`).then((infoResponse) => {
			const availableMigrations = infoResponse.body.migrations.available.length

			expect(infoResponse.body.migrations.applied).to.be.empty
			expect(infoResponse.body.migrations.available).to.not.be.empty

			cy.authorizedRequest('PUT', `${Cypress.env('API_URL')}/db/migrate`).then((putResponse) => {
				expect(putResponse.status).to.eq(200)
				expect(putResponse.body.message).to.equal('Migrations applied successfully!')

				cy.request('GET', `${Cypress.env('API_URL')}/db`).then((afterResponse) => {
					expect(afterResponse.status).to.eq(200)
					expect(afterResponse.body.migrations.current).to.exist
					expect(afterResponse.body.migrations.applied.length).to.equal(availableMigrations)
					expect(afterResponse.body.migrations.available).to.be.empty
				})
			})
		})
	})

	it('database cannot be migrated multiple times', () => {
		// Reset database
		cy.resetDatabase()

		cy.authorizedRequest('PUT', `${Cypress.env('API_URL')}/db/migrate`).then((putResponse) => {
			expect(putResponse.status).to.eq(200)
			expect(putResponse.body.message).to.equal('Migrations applied successfully!')
		})

		cy.authorizedRequest({
			method: 'PUT',
			url: `${Cypress.env('API_URL')}/db/migrate`,
			failOnStatusCode: false,
		}).then((secondResponse) => {
			expect(secondResponse.status).to.eq(400)
			expect(secondResponse.body.message).to.equal('No migrations to apply!')
		})
	})
})
