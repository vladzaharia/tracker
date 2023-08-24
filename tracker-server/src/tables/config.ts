import { ConfigTable, getKyselyDb } from './db'

export interface FetchInfo {
	cron?: {
		schedule?: string
		last_run: string
		next_run?: string
		reason?: 'schedule' | 'manual'
	}
	trips?: {
		imported: number
		skipped: number
		points: number
	}
	waypoints?: {
		imported: number
		updated: number
		skipped: number
	}
}

export async function dropConfigTable(db: D1Database) {
	const dropTableResult = await db.exec(`DROP TABLE IF EXISTS config`)

	return dropTableResult
}

export async function listConfig(db: D1Database) {
	return await getKyselyDb(db).selectFrom('config').selectAll().execute()
}

export async function findConfig(db: D1Database, id: string) {
	return await getKyselyDb(db).selectFrom('config').selectAll().where('id', '=', id).executeTakeFirst()
}

export async function insertConfig(db: D1Database, config: ConfigTable) {
	return await getKyselyDb(db).insertInto('config').values(config).execute()
}

export async function updateConfigValue(db: D1Database, id: string, value: string) {
	return await getKyselyDb(db).updateTable('config').set({ value }).where('id', '=', id).execute()
}

export async function updateLastFetchInfo(db: D1Database, lastFetch: FetchInfo) {
	const existingValue = await findConfig(db, 'last_fetch_info')

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const value: { [key: string]: any } = existingValue ? JSON.parse(existingValue.value) : {}

	if (lastFetch.cron) {
		value.cron = lastFetch.cron
	}
	if (lastFetch.trips) {
		value.trips = lastFetch.trips
	}
	if (lastFetch.waypoints) {
		value.waypoints = lastFetch.waypoints
	}

	return await updateConfigValue(db, 'last_fetch_info', JSON.stringify(value))
}

export async function deleteConfig(db: D1Database, id: string) {
	return await getKyselyDb(db).deleteFrom('config').where('id', '=', id).execute()
}
