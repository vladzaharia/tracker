beforeEach(() => {
	SetupDatabase()
})

export const ResetDatabase = () => {
	cy.authorizedRequest('PUT', `${Cypress.env('API_URL')}/db/reset`).then((resetResponse) => {
		expect(resetResponse.status).to.eq(200)
	})
}

export const SetupDatabase = () => {
	// Clean up and migrate DB to current version
	ResetDatabase()

	cy.authorizedRequest('PUT', `${Cypress.env('API_URL')}/db/migrate`).then((migrateResponse) => {
		expect(migrateResponse.status).to.eq(200)
	})

	cy.request('GET', `${Cypress.env('API_URL')}/db`).then((infoResponse) => {
		expect(infoResponse.body.migrations.current).to.exist
		expect(infoResponse.body.migrations.available.length).to.equal(0)

		// Apply config updates
		cy.authorizedRequest('PATCH', `${Cypress.env('API_URL')}/config/garmin_username`, { value: Cypress.env('GARMIN_USERNAME') })
		cy.authorizedRequest('PATCH', `${Cypress.env('API_URL')}/config/mapbox_access_token`, { value: Cypress.env('MAPBOX_API_TOKEN') })
		cy.authorizedRequest('PATCH', `${Cypress.env('API_URL')}/config/oidc_authority`, { value: Cypress.env('OIDC_AUTHORITY') })
		cy.authorizedRequest('PATCH', `${Cypress.env('API_URL')}/config/oidc_client_id`, { value: Cypress.env('OIDC_CLIENT_ID') })
		cy.authorizedRequest('PATCH', `${Cypress.env('API_URL')}/config/oidc_scope`, { value: Cypress.env('OIDC_SCOPE') })
		cy.authorizedRequest('PATCH', `${Cypress.env('API_URL')}/config/oidc_client_secret`, { value: Cypress.env('OIDC_SECRET') })
	})
}
