import { Bindings } from '../bindings'
import { findTrip } from '../tables/trip'

const KML_URL = 'https://share.garmin.com/Feed/Share/mynameisvlad' // ?d1=2021-09-01T00:00:00&d2=2023-07-24T00:00:00

export const getTripKML = async (env: Bindings, trip: string) => {
	const tripDetails = await findTrip(env.D1DATABASE, trip)

	if (!tripDetails) {
		throw new Error('Trip not found!')
	}

	return getKML(new Date(tripDetails.start_date), new Date(tripDetails.end_date))
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
