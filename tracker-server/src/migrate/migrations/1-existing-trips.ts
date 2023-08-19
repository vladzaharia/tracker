import { insertTrip, deleteTrip } from '../../tables/trip'
import { getExistingTrips } from './existing-trips/trip'
import { Migration } from '../types'

export const MIGRATION_1_EXISTING_TRIPS: Migration = {
	version: 1,
	name: 'existing-trips',
	up: async (db: D1Database) => {
		for (const trip of getExistingTrips('prod')) {
			await insertTrip(db, {
				id: trip.id,
				name: trip.name,
				emoji: trip.emoji,
				type: trip.type,
				start_date: trip.start_date.getTime(),
				end_date: trip.end_date.getTime(),
				time_zone: trip.time_zone,
			})
		}
	},
	down: async (db: D1Database) => {
		for (const trip of getExistingTrips('prod')) {
			await deleteTrip(db, trip.id)
		}
	},
}
