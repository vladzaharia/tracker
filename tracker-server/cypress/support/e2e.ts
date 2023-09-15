import './authorization'
import './commands'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authRequest<T = any>(method: string, url: string, body?: Cypress.RequestBody): Cypress.Chainable<Cypress.Response<T>>
    }
  }
}
