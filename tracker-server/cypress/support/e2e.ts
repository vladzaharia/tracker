/* eslint-disable @typescript-eslint/no-explicit-any */
import './commands'
import './database'

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		interface Chainable {
			authorizedRequest<T = any>(method: string, url: string, body?: Cypress.RequestBody): Cypress.Chainable<Cypress.Response<T>>
			authorizedRequest<T = any>(options: Partial<Cypress.RequestOptions>): Cypress.Chainable<Cypress.Response<T>>
			setup(): Cypress.Chainable<Cypress.Response<any>>
			resetDatabase(): Cypress.Chainable<Cypress.Response<any>>
		}
	}
}
