/// <reference types="cypress" />

import { ResetDatabase, SetupDatabase } from './database'

Cypress.Commands.add(
	'authorizedRequest',
	(methodOrOptions: string | Partial<Cypress.RequestOptions>, url?: string, body?: Cypress.RequestBody) => {
		if (typeof methodOrOptions === 'string') {
			return cy.request({
				method: methodOrOptions,
				url,
				body,
				headers: {
					Authorization: `Bearer ${Cypress.env('TRACKER_API_TOKEN')}`,
				},
			})
		} else {
			return cy.request({
				...methodOrOptions,
				headers: {
					...methodOrOptions.headers,
					Authorization: `Bearer ${Cypress.env('TRACKER_API_TOKEN')}`,
				},
			})
		}
	}
)

Cypress.Commands.add('setup', SetupDatabase)

Cypress.Commands.add('resetDatabase', ResetDatabase)
