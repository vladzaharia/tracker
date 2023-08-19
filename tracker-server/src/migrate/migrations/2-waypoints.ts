import { createMigrationTable } from '../../tables/migration'
import { dropWaypointTable } from '../../tables/waypoint'
import { Migration } from '../types'

export const MIGRATION_2_WAYPOINTS: Migration = {
	version: 2,
	name: 'waypoints',
	up: async (db: D1Database) => {
		await db.exec(
			`CREATE TABLE IF NOT EXISTS waypoint (trip_id TEXT, name TEXT, latitude NUMBER, longitude NUMBER, timestamp NUMBER, CONSTRAINT pk_waypoint PRIMARY KEY (trip_id,name));`
		)
		await createMigrationTable(db)
	},
	down: async (db: D1Database) => {
		await dropWaypointTable(db)
	},
}
