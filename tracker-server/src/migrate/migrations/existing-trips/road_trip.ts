import { Trip } from '../../../types'

export const TRIP_ROAD_TRIP: Trip = {
	name: 'Road Trip',
	id: 'road-trip',
	emoji: '🚐',
	type: 'road',
	start_date: new Date(2022, 8, 13),
	end_date: new Date(2022, 9, 2, 23, 59, 59),
	time_zone: 'America/Los_Angeles',
}
