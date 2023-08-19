import { Kysely } from 'kysely'
import { D1Dialect } from 'kysely-d1'

export interface Database {
	trip: TripTable
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

export type TripType = 'scuba' | 'road'

export interface MigrationTable {
	version: number
	name: string
	applied: number
	rolledBack?: number
}

export const getKyselyDb = (database: D1Database) => {
	return new Kysely<Database>({ dialect: new D1Dialect({ database }) })
}
