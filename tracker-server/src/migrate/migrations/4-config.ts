import { dropConfigTable, insertConfig } from '../../tables/config'
import { Migration } from '../types'

export const MIGRATION_4_CONFIG: Migration = {
	version: 2,
	name: 'waypoints',
	up: async (db: D1Database) => {
		await db.exec(
			`CREATE TABLE IF NOT EXISTS config (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL, value TEXT NOT NULL, editable INTEGER NOT NULL);`
		)
		await insertConfig(db, {
			id: 'garmin_username',
			name: 'Garmin username',
			description: 'The username of the Garmin account to fetch data from.',
			value: '',
			editable: 1
		})
		await insertConfig(db, {
			id: 'last_fetch_time',
			name: 'Last fetch time',
			description: 'The last time the tracker fetched new data from Garmin',
			value: '1970-01-01T00:00:00.000Z',
			editable: 0
		})
	},
	down: async (db: D1Database) => {
		await dropConfigTable(db)
	},
}
