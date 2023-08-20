import { createMigrationTable } from '../../tables/migration'
import { dropTripTable } from '../../tables/trip'
import { Migration } from '../types'

export const MIGRATION_0_INITIAL: Migration = {
	version: 0,
	name: 'initial-migration',
	up: async (db: D1Database) => {
		await db.exec(
			`CREATE TABLE IF NOT EXISTS trip (id TEXT PRIMARY KEY, name TEXT NOT NULL, emoji TEXT NOT NULL, type TEXT NOT NULL, start_date INTEGER NOT NULL, end_date INTEGER NOT NULL, time_zone STRING NOT NULL);`
		)
		await createMigrationTable(db)
	},
	down: async (db: D1Database) => {
		await dropTripTable(db)
	},
}
