import { Kysely } from 'kysely'
import { D1Dialect } from 'kysely-d1'
import { TripType } from '../types'

export type StringColumn = string
export type NumberColumn = number
export type FormatColumn = 'text' | 'number' | 'boolean' | 'datetime'
export type BooleanColumn = 0 | 1

export interface Database {
	trip: TripTable
	waypoint: WaypointTable
	config: ConfigTable
	migration: MigrationTable
}

export interface TripTable {
	name: StringColumn
	id: StringColumn
	emoji: StringColumn
	type: TripType
	start_date: NumberColumn
	end_date: NumberColumn
	time_zone: StringColumn
	num_points?: NumberColumn
}

export interface WaypointTable {
	trip_id: StringColumn
	name: StringColumn
	icon?: StringColumn
	color?: StringColumn
	latitude: NumberColumn
	longitude: NumberColumn
	timestamp: NumberColumn
	managed: BooleanColumn
	prominent: BooleanColumn
}

export interface ConfigTable {
	id: StringColumn
	name: StringColumn
	description: StringColumn
	value: StringColumn
	format: FormatColumn
	editable: BooleanColumn
	secret?: BooleanColumn
	hidden?: BooleanColumn
	category?: StringColumn
}

export interface MigrationTable {
	version: NumberColumn
	name: StringColumn
	applied: NumberColumn
	rolledBack?: NumberColumn
}

export const getKyselyDb = (database: D1Database) => {
	return new Kysely<Database>({ dialect: new D1Dialect({ database }) })
}
