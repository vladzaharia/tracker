/// <reference types="cypress" />

Cypress.Commands.add(
  'authRequest',
  (method: string, url: string, body?: Cypress.RequestBody) => {
    return cy.request({
			method,
			url,
			body,
			headers: {
				Authorization: `Bearer ${Cypress.env('TRACKER_API_TOKEN')}`,
			}
		})
  }
)
