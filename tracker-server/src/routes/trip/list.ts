import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { findCurrentTrip, listPastTrips, listUpcomingTrips } from '../../tables/trip'
import { Trip } from '../../types'
import { ConvertTrip } from './util'

export const ListTrips = async (c: Context<{ Bindings: Bindings }>) => {
	const { showStatus, showTotals, showCenterPoint } = c.req.query()

	const currentTrip = await findCurrentTrip(c.env.D1DATABASE)
	const upcomingTrips = await listUpcomingTrips(c.env.D1DATABASE)
	const pastTrips = await listPastTrips(c.env.D1DATABASE)

	const convertedUpcomingTrips: Trip[] = []
	const convertedPastTrips: Trip[] = []

	for (const trip of upcomingTrips) {
		convertedUpcomingTrips.push(await ConvertTrip(c, trip, showStatus === 'true', showTotals === 'true', showCenterPoint === 'true'))
	}

	for (const trip of pastTrips) {
		convertedPastTrips.push(await ConvertTrip(c, trip, showStatus === 'true', showTotals === 'true', showCenterPoint === 'true'))
	}

	return c.json(
		{
			current: currentTrip && {
				...(await ConvertTrip(c, currentTrip, true, true, showCenterPoint === 'true')),
			},
			upcoming: convertedUpcomingTrips,
			past: convertedPastTrips,
		},
		200
	)
}
