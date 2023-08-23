import { WaypointTable, getKyselyDb } from './db'

export async function dropWaypointTable(db: D1Database) {
	const dropTableResult = await db.exec(`DROP TABLE IF EXISTS waypoint`)

	return dropTableResult
}

export async function listWaypoints(db: D1Database) {
	return await getKyselyDb(db).selectFrom('waypoint').selectAll().orderBy('timestamp').execute()
}

export async function listWaypointsForTrip(db: D1Database, tripId: string) {
	return await getKyselyDb(db).selectFrom('waypoint').selectAll().where('trip_id', '=', tripId).orderBy('timestamp').execute()
}

export async function findWaypointInTrip(db: D1Database, tripId: string, timestamp: number) {
	return await getKyselyDb(db)
		.selectFrom('waypoint')
		.selectAll()
		.where(({ and, cmpr }) => and([cmpr('trip_id', '=', tripId), cmpr('timestamp', '=', timestamp)]))
		.executeTakeFirst()
}

export async function insertWaypoint(db: D1Database, waypoint: Omit<WaypointTable, 'managed'>, isManaged = false) {
	return await getKyselyDb(db)
		.insertInto('waypoint')
		.values({
			...waypoint,
			managed: isManaged ? 1 : 0
		})
		.execute()
}

export async function updateWaypoint(
	db: D1Database,
	tripId: string,
	timestamp: number,
	waypoint: Partial<Omit<WaypointTable, 'trip_id' | 'timestamp'>>
) {
	return await getKyselyDb(db)
		.updateTable('waypoint')
		.set(waypoint)
		.where(({ and, cmpr }) => and([cmpr('trip_id', '=', tripId), cmpr('timestamp', '=', timestamp)]))
		.execute()
}

export async function deleteWaypoint(db: D1Database, tripId: string, timestamp: number) {
	return await getKyselyDb(db)
		.deleteFrom('waypoint')
		.where(({ and, cmpr }) => and([cmpr('trip_id', '=', tripId), cmpr('timestamp', '=', timestamp)]))
		.execute()
}
