import { Context } from 'hono'
import { Info } from './info'
import { Bindings } from '../bindings'
import { createContext } from '../testutil'

describe('Info', () => {
	let context: Context<{ Bindings: Bindings }>
	beforeEach(() => {
		context = createContext()
	})

	describe('message', () => {
		test('ok message', async () => {
			const result = await Info(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.message).toEqual('ok')
		})
	})
})
