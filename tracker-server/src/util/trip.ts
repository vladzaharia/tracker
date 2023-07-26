import { TRIP_BAHAMAS_2022 } from '../trips/bahamas_2022'
import { TRIP_BAHAMAS_2024 } from '../trips/bahamas_2024'
import { TRIP_MEXICO } from '../trips/mexico'
import { TRIP_PHILIPPINES } from '../trips/philippines'
import { TRIP_ROAD_TRIP } from '../trips/road_trip'
import { AllTrips } from '../trips/types'

export const getTrips = () => {
	return [TRIP_MEXICO, TRIP_BAHAMAS_2022, TRIP_BAHAMAS_2024, TRIP_ROAD_TRIP, TRIP_PHILIPPINES]
}

export const getTrip = (tripName: AllTrips) => {
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
	}
}
