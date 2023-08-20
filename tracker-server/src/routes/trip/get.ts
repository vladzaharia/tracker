import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { Activity } from '../../util/activity'
import { Trip } from '../../types'
import { findTrip } from '../../tables/trip'
import { ConvertTrip, GetTripStatus, GetTripWaypoints } from './util'
import { WaypointTable } from '../../tables/db'
import { listWaypointsForTrip } from '../../tables/waypoint'

interface GetTripResponse extends Trip, GetTripStatus, TripWaypoints {}

interface GetTripStatus {
	status: {
		activity: Activity
		position: {
			latitude: number
			longitude: number
			timestamp: string
			velocity: number
			course: number
		}
	}
}

interface TripWaypoints {
	waypoints?: WaypointTable[]
}

export const GetTrip = async (c: Context<{ Bindings: Bindings }>) => {
	const { trip } = c.req.param()

	const tripDetails = await findTrip(c.env.D1DATABASE, trip)

	if (!tripDetails) {
		return c.json({ message: 'Trip not found!' }, 404)
	}

	const waypoints = await listWaypointsForTrip(c.env.D1DATABASE, tripDetails.id)

	return c.json(
		{
			...(await GetTripWaypoints(c, tripDetails)),
			...(await ConvertTrip(c, tripDetails)),
			waypoints,
		} as GetTripResponse,
		200
	)
}
