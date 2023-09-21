import { Migration } from '../types'

export const MIGRATION_9_TRIP_POINTS: Migration = {
	version: 9,
	name: 'trip-points',
	up: async (db: D1Database) => {
		// Add num_points column
		await db.exec(`ALTER TABLE trip ADD COLUMN num_points INTEGER;`)
	},
	down: async (db: D1Database) => {
		await db.exec(`ALTER TABLE trip DROP COLUMN num_points;`)
	},
}
