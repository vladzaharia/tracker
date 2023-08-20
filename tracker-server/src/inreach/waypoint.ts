import moment from 'moment'
import { Bindings } from '../bindings'
import { WaypointTable } from '../tables/db'
import { listTripsForTimestamp } from '../tables/trip'

const WAYPOINT_URL = 'https://share.garmin.com/mynameisvlad/Waypoints/'

export const getWaypoints = async (env: Bindings) => {
	const waypoints = await getWaypointsFromGarmin()

	const result: WaypointTable[] = []

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

const getWaypointsFromGarmin = async () => {
	const url = new URL(WAYPOINT_URL)

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
