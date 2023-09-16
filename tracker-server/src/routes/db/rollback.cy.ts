context('PUT /db/rollback', () => {
	it('database is properly rolled back', () => {
		// Get current db info
		cy.request('GET', `${Cypress.env('API_URL')}/db`).then((infoResponse) => {
			const currentMigration = infoResponse.body.migrations.current
			const availableMigrations = infoResponse.body.migrations.available.length
			const appliedMigrations = infoResponse.body.migrations.applied.length

			cy.authorizedRequest('PUT', `${Cypress.env('API_URL')}/db/rollback`).then((putResponse) => {
				expect(putResponse.status).to.eq(200)
				expect(putResponse.body.message).to.equal('Migration rolled back successfully!')
			})

			cy.request('GET', `${Cypress.env('API_URL')}/db`).then((afterResponse) => {
				expect(afterResponse.status).to.eq(200)
				expect(afterResponse.body.migrations.current).to.exist
				expect(afterResponse.body.migrations.current.version).to.lt(currentMigration.version)

				// Should have an extra migration available to apply
				expect(afterResponse.body.migrations.available.length).to.equal(availableMigrations + 1)

				// Migration shouldn't change, should be updated instead
				expect(afterResponse.body.migrations.applied.length).to.equal(appliedMigrations)
				expect(afterResponse.body.migrations.applied[0].rolledBack).to.exist
			})
		})
	})

	it('can rollback all migrations', () => {
		// Get current db info
		cy.request('GET', `${Cypress.env('API_URL')}/db`).then((infoResponse) => {
			const appliedMigrations = infoResponse.body.migrations.applied.length

			for (let i = 0; i < appliedMigrations - 1; i++) {
				cy.authorizedRequest('PUT', `${Cypress.env('API_URL')}/db/rollback`).then((putResponse) => {
					expect(putResponse.status).to.eq(200)
					expect(putResponse.body.message).to.equal('Migration rolled back successfully!')
				})
			}
		})
	})

	it('cannot rollback if there is no migration present', () => {
		cy.resetDatabase()

		// Get current db info
		cy.request('GET', `${Cypress.env('API_URL')}/db`).then((infoResponse) => {
			expect(infoResponse.body.migrations.applied).to.be.empty
			expect(infoResponse.body.migrations.current).to.not.exist

			cy.authorizedRequest({
				method: 'PUT',
				url: `${Cypress.env('API_URL')}/db/rollback`,
				failOnStatusCode: false,
			}).then((secondResponse) => {
				expect(secondResponse.status).to.eq(400)
				expect(secondResponse.body.message).to.equal('No migrations to roll back!')
			})
		})
	})
})
