import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { updateTrip } from '../../tables/trip'
import { WaypointTable } from '../../tables/db'
import { findWaypointInTrip } from '../../tables/waypoint'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UpdateWaypointBody extends Omit<WaypointTable, 'trip_id' | 'timestamp' | 'latitude' | 'longitude'> {}

export const UpdateWaypoint = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE
		const { trip, timestamp } = c.req.param()
		const updated_props = await c.req.json<UpdateWaypointBody>()

		// Check if any keys are set
		if (Object.keys(updated_props).length === 0) {
			return c.json({ message: 'Must set at least one property!' }, 400)
		}

		// Try to find trip
		const record = await findWaypointInTrip(db, trip, parseInt(timestamp, 10))
		if (!record) {
			return c.json({ message: 'Trip not found!' }, 404)
		}

		// Update trip
		await updateTrip(db, trip, {
			name: updated_props.name,
		})

		return c.json({ message: 'Successfully updated trip!' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
