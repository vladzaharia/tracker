import { TripTable, getKyselyDb } from './db'

export async function dropTripTable(db: D1Database) {
	const dropTableResult = await db.exec(`DROP TABLE IF EXISTS trip`)

	return dropTableResult
}

export async function listTrips(db: D1Database) {
	return await getKyselyDb(db).selectFrom('trip').selectAll().orderBy('start_date', 'desc').execute()
}

export async function listUpcomingTrips(db: D1Database) {
	return await getKyselyDb(db)
		.selectFrom('trip')
		.where('start_date', '>', new Date().getTime())
		.selectAll()
		.orderBy('start_date', 'asc')
		.execute()
}

export async function listPastTrips(db: D1Database) {
	return await getKyselyDb(db)
		.selectFrom('trip')
		.where('end_date', '<', new Date().getTime())
		.selectAll()
		.orderBy('start_date', 'desc')
		.execute()
}

export async function findCurrentTrip(db: D1Database) {
	const currentDate = new Date().getTime()

	return await getKyselyDb(db)
		.selectFrom('trip')
		.selectAll()
		.where('start_date', '<', currentDate)
		.where('end_date', '>', currentDate)
		.executeTakeFirst()
}

export async function findTrip(db: D1Database, id: string) {
	return await getKyselyDb(db).selectFrom('trip').selectAll().where('id', '=', id).executeTakeFirst()
}

export async function listTripsForTimestamp(db: D1Database, timestamp: number) {
	return await getKyselyDb(db)
		.selectFrom('trip')
		.selectAll()
		.where('start_date', '<', timestamp)
		.where('end_date', '>', timestamp)
		.execute()
}

export async function insertTrip(db: D1Database, trip: TripTable) {
	return await getKyselyDb(db).insertInto('trip').values(trip).execute()
}

export async function updateTrip(db: D1Database, id: string, trip: Partial<Omit<TripTable, 'id'>>) {
	return await getKyselyDb(db).updateTable('trip').set(trip).where('id', '=', id).execute()
}

export async function deleteTrip(db: D1Database, id: string) {
	return await getKyselyDb(db).deleteFrom('trip').where('id', '=', id).execute()
}
