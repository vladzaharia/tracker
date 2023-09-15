beforeEach(() => {
	cy.intercept(`${Cypress.env('API_URL')}**`, req => {
			req.headers['Authorization'] = Cypress.env('TRACKER_API_TOKEN')
	})
})
