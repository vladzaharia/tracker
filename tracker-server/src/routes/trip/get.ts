import { Context } from 'hono'
import { getTrip } from '../../util/trip'
import { AllTrips, Trip } from '../../trips/types'
import { Bindings } from '../../bindings'
import { Activity, GetActivity, VelocityRegex } from '../../util/activity'

interface GetTripResponse extends Trip, GetTripStatus {}

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

export const GetTrip = async (c: Context<{ Bindings: Bindings }>) => {
	const { trip } = c.req.param()

	const tripDetails = getTrip(trip as AllTrips)

	if (!tripDetails) {
		return c.json({ message: 'Trip not found!' }, 404)
	}

	const jsonString = await c.env.GEOJSON.get(`${tripDetails.id}-points`)
	let status: GetTripStatus | undefined

	if (jsonString) {
		const points = JSON.parse(jsonString).features
		const lastPoint = points && points[points.length - 1]
		const velocityMatch = lastPoint?.properties?.Velocity?.match(VelocityRegex)
		const courseMatch = lastPoint?.properties?.Course?.match(/(\d{1,3}\.\d{2}) ° True/)

		status = {
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

	return c.json(
		{
			...tripDetails,
			...status,
		} as GetTripResponse,
		200
	)
}
