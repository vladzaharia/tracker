import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { deleteWaypoint, findWaypointInTrip } from '../../tables/waypoint'

export const DeleteWaypoint = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE
		const { trip, timestamp } = c.req.param()

		// Try to find waypoint
		const record = await findWaypointInTrip(db, trip, parseInt(timestamp, 10))
		if (!record) {
			return c.json({ message: 'Waypoint not found!' }, 404)
		}

		// Check if waypoint is managed
		if (record.managed === 1) {
			return c.json({ message: 'Cannot delete managed waypoint!' }, 400)
		}

		// Delete waypoint
		await deleteWaypoint(db, trip, parseInt(timestamp, 10))

		return c.json({ message: 'Successfully deleted waypoint!' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
