import moment from 'moment'
import { ConfigTable, getKyselyDb } from './db'

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

export async function updateLastFetchTime(db: D1Database) {
	return await updateConfigValue(db, 'last_fetch_time', moment().toISOString())
}
