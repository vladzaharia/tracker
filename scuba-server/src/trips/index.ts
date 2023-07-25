import { TRIP_BAHAMAS_2022 } from './bahamas_2022'
import { TRIP_MEXICO } from './mexico'
import { TRIP_PHILIPPINES } from './philippines'
import { TRIP_ROAD_TRIP } from './road_trip'
import { AllTrips } from './types'

export const getTrips = () => {
	return [TRIP_MEXICO, TRIP_BAHAMAS_2022, TRIP_ROAD_TRIP, TRIP_PHILIPPINES]
}

export const getTrip = (tripName: AllTrips) => {
	switch (tripName) {
		case 'mexico':
			return TRIP_MEXICO
		case 'bahamas-2022':
			return TRIP_BAHAMAS_2022
		case 'road-trip':
			return TRIP_ROAD_TRIP
		case 'philippines':
			return TRIP_PHILIPPINES
	}
}
