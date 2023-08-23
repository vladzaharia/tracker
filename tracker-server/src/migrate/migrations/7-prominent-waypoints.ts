import { Migration } from '../types'

export const MIGRATION_7_PROMINENT_WAYPOINTS: Migration = {
	version: 7,
	name: 'prominent-waypoints',
	up: async (db: D1Database) => {
		// Add managed column
		await db.exec(`ALTER TABLE waypoint ADD COLUMN prominent INTEGER;`)

		// Set existing rows to 0
		await db.exec(`UPDATE waypoint SET managed = 0;`)
	},
	down: async (db: D1Database) => {
		await db.exec(`ALTER TABLE waypoint DROP COLUMN prominent;`)
	},
}
