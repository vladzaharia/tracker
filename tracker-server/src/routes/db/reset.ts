import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { dropMigrationTable } from '../../tables/migration'
import { dropTripTable } from '../../tables/trip'

export const ResetDb = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		// Drop all tables
		await dropTripTable(db)
		await dropMigrationTable(db)

		return c.json({
			message: 'Database reset successfully!',
		})
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
