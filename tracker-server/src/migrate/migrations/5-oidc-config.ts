import { insertConfig } from '../../tables/config'
import { Migration } from '../types'

export const MIGRATION_5_OIDC_CONFIG: Migration = {
	version: 5,
	name: 'oidc-config',
	up: async (db: D1Database) => {
		// Add columns
		await db.exec(`ALTER TABLE config ADD COLUMN secret INTEGER;`)
		await db.exec(`ALTER TABLE config ADD COLUMN category TEXT;`)

		// Set existing rows to secret=0
		await db.exec(`UPDATE config SET secret = 0;`)

		// Insert new OIDC entries
		await insertConfig(db, {
			id: 'oidc_authority',
			name: 'OIDC authority',
			description: 'URL of OIDC authority.',
			value: '',
			format: 'text',
			editable: 1,
			category: 'OIDC'
		})
		await insertConfig(db, {
			id: 'oidc_client_id',
			name: 'OIDC client ID',
			description: 'Client ID from authority.',
			value: '',
			format: 'text',
			editable: 1,
			category: 'OIDC'
		})
		await insertConfig(db, {
			id: 'oidc_client_secret',
			name: 'OIDC client secret',
			description: 'Client secret from authority.',
			value: '',
			format: 'text',
			editable: 1,
			secret: 1,
			category: 'OIDC'
		})
		await insertConfig(db, {
			id: 'oidc_scope',
			name: 'OIDC scopes',
			description: 'Scopes to request from authority.',
			value: 'openid profile',
			format: 'text',
			editable: 1,
			category: 'OIDC'
		})
	},
	down: async (db: D1Database) => {
		await db.exec(`ALTER TABLE config DROP COLUMN secret;`)
		await db.exec(`ALTER TABLE config DROP COLUMN category;`)
	},
}
