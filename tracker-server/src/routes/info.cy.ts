context('GET /', () => {
	it('returns ok', () => {
		cy.request('GET', `${Cypress.env('API_URL')}/`).then((response) => {
			expect(response.status).to.eq(200)
			expect(response.body.message).to.eq('ok')
		})
	})
})
