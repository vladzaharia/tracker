context('GET /db', () => {
	it('response structure is ok', () => {
		cy.request('GET', `${Cypress.env('API_URL')}/db`).then((response) => {
			expect(response.status).to.eq(200)
			expect(response.body.migrations).to.exist
			expect(response.body.migrations).to.have.ownProperty('available')
			expect(response.body.migrations).to.have.ownProperty('applied')
		})
	})

	it('binding is correct', () => {
		cy.request('GET', `${Cypress.env('API_URL')}/db`).then((response) => {
			expect(response.status).to.eq(200)
			expect(response.body.binding).to.exist
			expect(response.body.binding.type).to.equal('Cloudflare D1')
			expect(response.body.binding.database).to.equal(`tracker-${Cypress.env('ENVIRONMENT')}`)
		})
	})

	it('applied/available migrations is correct', () => {
		cy.request('GET', `${Cypress.env('API_URL')}/db`).then((infoResponse) => {
			expect(infoResponse.status).to.eq(200)
			expect(infoResponse.body.migrations.current.version).to.equal(infoResponse.body.migrations.applied[0].version)
			expect(infoResponse.body.migrations.available).to.be.empty
		})
	})
})
