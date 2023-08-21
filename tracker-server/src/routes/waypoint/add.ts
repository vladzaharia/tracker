import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { WaypointTable } from '../../tables/db'
import { findWaypointInTrip, insertWaypoint } from '../../tables/waypoint'
import { findTrip } from '../../tables/trip'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AddWaypointBody extends Omit<WaypointTable, 'trip_id' | 'timestamp' | 'managed'> {}

export const AddWaypoint = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE
		const { trip, timestamp } = c.req.param()
		const { name, color, icon, latitude, longitude } = await c.req.json<AddWaypointBody>()

		// Check if params are passed in
		if (!name) {
			return c.json({ message: 'Must set `name`!' }, 400)
		}

		if (!latitude) {
			return c.json({ message: 'Must set `latitude`!' }, 400)
		}

		if (!longitude) {
			return c.json({ message: 'Must set `longitude`!' }, 400)
		}

		// Try to find trip
		const tripRecord = await findTrip(db, trip)
		if (!tripRecord) {
			return c.json({ message: 'Trip not found!' }, 404)
		}

		// Try to find waypoint
		const record = await findWaypointInTrip(db, trip, parseInt(timestamp, 10))
		if (record) {
			return c.json({ message: 'Waypoint already exists!' }, 400)
		}

		// Add waypoint
		await insertWaypoint(db, {
			trip_id: trip,
			timestamp: parseInt(timestamp, 10),
			name,
			icon,
			color,
			latitude,
			longitude,
		})

		return c.json({ message: 'Successfully added waypoint!' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
