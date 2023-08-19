import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { Trip } from '../../types'
import { VelocityRegex, GetActivity } from '../../util/activity'
import moment from 'moment'
import { TripTable } from '../../tables/db'
import { listWaypointsForTrip } from '../../tables/waypoint'

export const GetTripWaypoints = async (c: Context<{ Bindings: Bindings }>, trip: TripTable) => {
	const waypoints = await listWaypointsForTrip(c.env.D1DATABASE, trip.id)

	return {
		waypoints: waypoints.length > 0 ? waypoints : undefined,
	}
}

export const ConvertTrip = async (c: Context<{ Bindings: Bindings }>, trip: TripTable) => {
	const convertedTrip: Trip = {
		...trip,
		start_date: moment(trip.start_date).toDate(),
		end_date: moment(trip.end_date).toDate(),
	}

	const waypoints = await listWaypointsForTrip(c.env.D1DATABASE, trip.id)

	return {
		...convertedTrip,
		...(await GetTripStatus(c, convertedTrip)),
		total_waypoints: waypoints.length,
	}
}

export const GetTripStatus = async (c: Context<{ Bindings: Bindings }>, tripDetails: Trip) => {
	const jsonString = await c.env.GEOJSON.get(`${tripDetails.id}-points`)

	if (jsonString) {
		const points = JSON.parse(jsonString).features

		if (points.length === 0) {
			return {
				total_points: 0,
			}
		}

		const lastPoint = points && points[points.length - 1]
		const velocityMatch = lastPoint?.properties?.Velocity?.match(VelocityRegex)
		const courseMatch = lastPoint?.properties?.Course?.match(/(\d{1,3}\.\d{2}) ° True/)

		return {
			last_point: lastPoint,
			total_points: points.length,
			status: {
				activity: GetActivity(lastPoint, tripDetails),
				position: {
					latitude: Number(lastPoint?.properties?.Latitude),
					longitude: Number(lastPoint?.properties?.Longitude),
					timestamp: lastPoint?.properties?.timestamp,
					velocity: Number(velocityMatch && velocityMatch[1]),
					course: Number(courseMatch && courseMatch[1]),
				},
			},
		}
	}
}
