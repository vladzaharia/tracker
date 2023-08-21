import moment from 'moment'
import { Bindings } from '../bindings'
import { WaypointTable } from '../tables/db'
import { listTripsForTimestamp } from '../tables/trip'
import { findConfig } from '../tables/config'

export const getWaypoints = async (env: Bindings) => {
	// Get Garmin Username
	const config = await findConfig(env.D1DATABASE, 'garmin_username')
	if (!config) {
		throw new Error('Garmin username not found!')
	}

	const waypoints = await getWaypointsFromGarmin(config.value)

	const result: Omit<WaypointTable, 'managed'>[] = []

	for (const wp of waypoints.Waypoints) {
		const trips = await listTripsForTimestamp(env.D1DATABASE, moment(wp.C).unix() * 1000)
		for (const trip of trips) {
			result.push({
				trip_id: trip.id,
				name: wp.X,
				latitude: wp.L,
				longitude: wp.N,
				timestamp: moment(wp.C).unix() * 1000,
			})
		}

		if (trips.length === 0) {
			console.log(`Waypoint ${wp.X} is not within any trip's duration!`)
		}
	}

	return result
}

const getWaypointsFromGarmin = async (username: string) => {
	const url = new URL(`https://share.garmin.com/${username}/Waypoints/`)

	const response = await fetch(url.toString(), {
		method: 'GET',
	})

	return await response.json<{ Waypoints: GarminWaypoint[] }>()
}

interface GarminWaypoint {
	/** Name */
	X: string
	/** Latitude */
	L: number
	/** Longitude */
	N: number
	/** Created time */
	C: string
}
