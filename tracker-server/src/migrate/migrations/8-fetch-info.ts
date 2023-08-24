import { deleteConfig, findConfig, insertConfig, updateLastFetchInfo } from '../../tables/config'
import { Migration } from '../types'

export const MIGRATION_8_FETCH_INFO: Migration = {
	version: 8,
	name: 'fetch-info',
	up: async (db: D1Database) => {
		// Add hidden column
		await db.exec(`ALTER TABLE config ADD COLUMN hidden INTEGER;`)

		// Set existing rows to 0
		await db.exec(`UPDATE config SET hidden = 0;`)

		// Add fetch info to config
		insertConfig(db, {
			id: 'last_fetch_info',
			name: 'Last fetch info',
			description: 'Information about when data was last fetched from Garmin.',
			value: JSON.stringify({}),
			editable: 0,
			hidden: 1,
			format: 'text',
		})

		// Get existing last_fetch_time
		const config = await findConfig(db, 'last_fetch_time')
		if (config) {
			await updateLastFetchInfo(db, { cron: { last_run: config.value } })
		}

		// Clean up last_fetch_time
		deleteConfig(db, 'last_fetch_time')

		// Update garmin_username
		await db.exec(`UPDATE config SET category = 'Garmin Sync' WHERE id = 'garmin_username';`)
	},
	down: async (db: D1Database) => {
		// Delete hidden column
		await db.exec(`ALTER TABLE config DROP COLUMN hidden;`)

		// Add last_fetch_time entry
		await insertConfig(db, {
			id: 'last_fetch_time',
			name: 'Last fetch time',
			description: 'The last time the tracker fetched new data from Garmin',
			value: '1970-01-01T00:00:00.000Z',
			format: 'datetime',
			editable: 0,
		})

		// Get existing last_fetch_info
		const config = await findConfig(db, 'last_fetch_info')

		// Extract timestamp
		const { timestamp } = JSON.parse(config?.value || '{}')

		if (config && timestamp) {
			await db.prepare(`UPDATE config SET value = ? WHERE id = 'last_fetch_time';`).bind(timestamp).run()
		}

		// Clean up last_fetch_info
		deleteConfig(db, 'last_fetch_info')
	},
}
