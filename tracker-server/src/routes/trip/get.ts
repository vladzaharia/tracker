import { Context } from 'hono'
import { getTrip } from '../../trips'
import { AllTrips } from '../../trips/types'
import { Bindings } from '../../bindings'

export const GetTrip = async (c: Context<{ Bindings: Bindings }>) => {
	const { trip } = c.req.param()

	const tripDetails = getTrip(trip as AllTrips)

	if (!tripDetails) {
		return c.json({ message: 'Trip not found!' }, 404)
	}

	return c.json(
		{
			...tripDetails,
		},
		200
	)
}
