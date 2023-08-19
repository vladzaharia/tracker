import { createMigrationTable } from '../../tables/migration'
import { dropTripTable } from '../../tables/trip'
import { Migration } from '../types'

export const MIGRATION_0_INITIAL: Migration = {
	version: 0,
	name: 'initial-migration',
	up: async (db: D1Database) => {
		await db.exec(
			`CREATE TABLE IF NOT EXISTS trip (id TEXT PRIMARY KEY, name TEXT, emoji TEXT, type TEXT, start_date INTEGER, end_date INTEGER, time_zone STRING);`
		)
		await createMigrationTable(db)
	},
	down: async (db: D1Database) => {
		await dropTripTable(db)
	},
}
