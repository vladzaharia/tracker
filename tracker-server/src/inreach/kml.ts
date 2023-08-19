import { getTrip } from '../migrate/migrations/existing-trips/trip'
import { AllTrips } from '../migrate/migrations/existing-trips/types'

const KML_URL = 'https://share.garmin.com/Feed/Share/mynameisvlad' // ?d1=2021-09-01T00:00:00&d2=2023-07-24T00:00:00

export const getTripKML = async (trip: AllTrips) => {
	const tripDetails = getTrip(trip)

	return getKML(tripDetails.start_date, tripDetails.end_date)
}

const getKML = async (startDate?: Date, endDate?: Date) => {
	const url = new URL(KML_URL)

	if (startDate) {
		url.searchParams.set('d1', startDate.toISOString())
	}

	if (endDate) {
		url.searchParams.set('d2', endDate.toISOString())
	}

	const response = await fetch(url.toString(), {
		method: 'GET',
	})

	return response
}
