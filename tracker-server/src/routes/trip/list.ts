import { Context } from 'hono'
import { getTrips } from '../../util/trip'
import { Bindings } from '../../bindings'
import moment from 'moment'
import { GetTripStatus } from './get'

export const ListTrips = async (c: Context<{ Bindings: Bindings }>) => {
	const trips = getTrips()

	const currentDate = moment()
	const currentBasicTrip = trips.filter((t) => moment(t.start_date) < currentDate && moment(t.end_date) > currentDate)[0]

	const upcomingTrips = trips.filter((t) => moment(t.end_date) > currentDate)
	const pastTrips = trips.filter((t) => moment(t.end_date) < currentDate)

	return c.json(
		{
			current: currentBasicTrip && {
				...currentBasicTrip,
				...(await GetTripStatus(c, currentBasicTrip)),
			},
			upcoming: upcomingTrips,
			past: pastTrips,
		},
		200
	)
}
