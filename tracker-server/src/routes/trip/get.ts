import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { Activity } from '../../util/activity'
import { Trip } from '../../types'
import { findTrip } from '../../tables/trip'
import { ConvertTrip, GetTripStatus } from './util'

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

	const tripDetails = await findTrip(c.env.D1DATABASE, trip)

	if (!tripDetails) {
		return c.json({ message: 'Trip not found!' }, 404)
	}

	return c.json(
		{
			...(await ConvertTrip(c, tripDetails, true)),
		} as GetTripResponse,
		200
	)
}
