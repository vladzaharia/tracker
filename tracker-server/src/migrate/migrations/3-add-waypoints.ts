import { Migration } from '../types'

export const MIGRATION_3_ADD_WAYPOINTS: Migration = {
	version: 3,
	name: 'add-waypoints',
	up: async (db: D1Database) => {
		await db.exec(
			`ALTER TABLE waypoint ADD COLUMN managed INTEGER;`
		)
	},
	down: async (db: D1Database) => {
		await db.exec(
			`ALTER TABLE waypoint DROP COLUMN managed;`
		)
	},
}
