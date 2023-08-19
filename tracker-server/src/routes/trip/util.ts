import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { Trip } from '../../types'
import { VelocityRegex, GetActivity } from '../../util/activity'
import moment from 'moment'
import { TripTable } from '../../tables/db'

export const ConvertTrip = async (c: Context<{ Bindings: Bindings }>, trip: TripTable) => {
	const convertedTrip: Trip = {
		...trip,
		start_date: moment(trip.start_date).toDate(),
		end_date: moment(trip.end_date).toDate(),
	}

	return {
		...convertedTrip,
		...(await GetTripStatus(c, convertedTrip)),
	}
}

export const GetTripStatus = async (c: Context<{ Bindings: Bindings }>, tripDetails: Trip) => {
	const jsonString = await c.env.GEOJSON.get(`${tripDetails.id}-points`)

	if (jsonString) {
		const points = JSON.parse(jsonString).features

		if (points.length === 0) {
			return {}
		}

		const lastPoint = points && points[points.length - 1]
		const velocityMatch = lastPoint?.properties?.Velocity?.match(VelocityRegex)
		const courseMatch = lastPoint?.properties?.Course?.match(/(\d{1,3}\.\d{2}) ° True/)

		return {
			lastPoint,
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
