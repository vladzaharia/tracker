import { Bindings } from '../bindings'
import { findConfig } from '../tables/config'
import { findTrip } from '../tables/trip'

export const getTripKML = async (env: Bindings, trip: string) => {
	// Get Garmin Username
	const config = await findConfig(env.D1DATABASE, 'garmin_username')
	if (!config) {
		throw new Error('Garmin username not found!')
	}

	const tripDetails = await findTrip(env.D1DATABASE, trip)

	if (!tripDetails) {
		throw new Error('Trip not found!')
	}

	return getKML(config.value, new Date(tripDetails.start_date), new Date(tripDetails.end_date))
}

const getKML = async (username: string, startDate?: Date, endDate?: Date) => {
	const url = new URL(`https://share.garmin.com/Feed/Share/${username}`)

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
