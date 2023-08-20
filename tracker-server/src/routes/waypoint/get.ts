import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { findWaypointInTrip } from '../../tables/waypoint'

export const GetWaypoint = async (c: Context<{ Bindings: Bindings }>) => {
	const { trip, timestamp } = c.req.param()

	const waypoint = await findWaypointInTrip(c.env.D1DATABASE, trip, parseInt(timestamp, 10))

	if (!waypoint) {
		return c.json({ message: 'Waypoint not found!' }, 404)
	}

	return c.json(waypoint, 200)
}
