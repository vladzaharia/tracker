import { deleteConfig, insertConfig } from '../../tables/config'
import { Migration } from '../types'

export const MIGRATION_6_MAPBOX_CONFIG: Migration = {
	version: 6,
	name: 'mapbox-config',
	up: async (db: D1Database) => {
		// Insert new mapbox entries
		await insertConfig(db, {
			id: 'mapbox_access_token',
			name: 'Access token',
			description: 'Token to use when rendering maps.',
			value: '',
			format: 'text',
			editable: 1,
			category: 'Mapbox'
		})
	},
	down: async (db: D1Database) => {
		await deleteConfig(db, 'mapbox_access_token')
	},
}
