import { Kysely } from 'kysely'
import { D1Dialect } from 'kysely-d1'
import { TripType } from '../types'

export interface Database {
	trip: TripTable
	waypoint: WaypointTable
	migration: MigrationTable
}

export interface TripTable {
	name: string
	id: string
	emoji: string
	type: TripType
	start_date: number
	end_date: number
	time_zone: string
}

export interface WaypointTable {
	trip_id: string
	name: string
	icon?: string
	latitude: number
	longitude: number
	timestamp: number
}

export interface MigrationTable {
	version: number
	name: string
	applied: number
	rolledBack?: number
}

export const getKyselyDb = (database: D1Database) => {
	return new Kysely<Database>({ dialect: new D1Dialect({ database }) })
}
