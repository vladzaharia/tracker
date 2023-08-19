import moment from 'moment'
import { TRIP_BAHAMAS_2022 } from './bahamas_2022'
import { TRIP_BAHAMAS_2024 } from './bahamas_2024'
import { TRIP_MEXICO } from './mexico'
import { TRIP_PHILIPPINES } from './philippines'
import { TRIP_ROAD_TRIP } from './road_trip'
import { Trip } from '../../../types'

const testTrip: Trip = {
	name: 'Test Trip',
	id: 'test',
	emoji: '🧪',
	start_date: moment().subtract(1, 'day').toDate(),
	end_date: moment().add(1, 'day').toDate(),
	time_zone: 'America/Los_Angeles',
	type: 'road',
}

export const getExistingTrips = (env?: string) => {
	const baseTrips = [TRIP_MEXICO, TRIP_BAHAMAS_2022, TRIP_BAHAMAS_2024, TRIP_ROAD_TRIP, TRIP_PHILIPPINES]

	if (env === 'local') {
		return [...baseTrips, testTrip]
	}

	return baseTrips
}

export const getCurrentTrip = (env?: string) => {
	const allTrips = getExistingTrips(env)

	const currentDate = moment(new Date())
	const currentTrip = allTrips.filter((t) => moment(t.start_date) < currentDate && currentDate < moment(t.end_date))

	return currentTrip[0]
}

export const getTrip = (tripName: string) => {
	switch (tripName) {
		case 'mexico':
			return TRIP_MEXICO
		case 'bahamas-2022':
			return TRIP_BAHAMAS_2022
		case 'bahamas-2024':
			return TRIP_BAHAMAS_2024
		case 'road-trip':
			return TRIP_ROAD_TRIP
		case 'philippines':
			return TRIP_PHILIPPINES
		case 'test':
			return testTrip
	}
}
