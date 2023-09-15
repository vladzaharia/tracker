import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { ResetDb } from './reset'
import { createContext } from '../../testutil'
import { vi } from 'vitest'

const mocks = vi.hoisted(() => {
	return {
		dropMigrationTable: vi.fn(),
		dropTripTable: vi.fn(),
		dropWaypointTable: vi.fn(),
		dropConfigTable: vi.fn(),
	}
})

vi.mock('../../tables/migration', () => {
	return {
		dropMigrationTable: mocks.dropMigrationTable,
	}
})

vi.mock('../../tables/trip', () => {
	return {
		dropTripTable: mocks.dropTripTable,
	}
})

vi.mock('../../tables/waypoint', () => {
	return {
		dropWaypointTable: mocks.dropWaypointTable,
	}
})

vi.mock('../../tables/config', () => {
	return {
		dropConfigTable: mocks.dropConfigTable,
	}
})

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe('MigrateDb', () => {
	let context: Context<{ Bindings: Bindings }>
	beforeEach(() => {
		context = createContext()
	})

	test('all tables are dropped', async () => {
		const result = await ResetDb(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.message).toEqual('Database reset successfully!')
		expect(mocks.dropMigrationTable).toBeCalledTimes(1)
		expect(mocks.dropConfigTable).toBeCalledTimes(1)
		expect(mocks.dropTripTable).toBeCalledTimes(1)
		expect(mocks.dropWaypointTable).toBeCalledTimes(1)
	})

	describe('errors', () => {
		test('generic error', async () => {
			mocks.dropTripTable.mockImplementationOnce(() => {
				throw new Error('The apocalypse is upon us')
			})

			const result = await ResetDb(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(500)
			expect(resultJson.message).toEqual('Something went wrong!')
		})
	})
})
