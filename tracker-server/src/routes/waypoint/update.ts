import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { WaypointTable } from '../../tables/db'
import { findWaypointInTrip, updateWaypoint } from '../../tables/waypoint'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UpdateWaypointBody extends Omit<WaypointTable, 'trip_id' | 'timestamp' | 'managed'> {}

export const UpdateWaypoint = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE
		const { trip, timestamp } = c.req.param()
		const updated_props = await c.req.json<UpdateWaypointBody>()
		const updatedKeys = Object.keys(updated_props)

		// Check if any keys are set
		if (updatedKeys.length === 0) {
			return c.json({ message: 'Must set at least one property!' }, 400)
		}

		// Try to find waypoint
		const record = await findWaypointInTrip(db, trip, parseInt(timestamp, 10))
		if (!record) {
			return c.json({ message: 'Waypoint not found!' }, 404)
		}

		// Check if waypoint is managed
		if (record.managed === 1) {
			if (updatedKeys.includes('latitude') || updatedKeys.includes('longitude')) {
				return c.json({ message: 'Cannot update latitude or longitude on managed waypoint!' }, 400)
			}
		}

		// Update waypoint
		await updateWaypoint(db, trip, parseInt(timestamp, 10), {
			name: updated_props.name,
			icon: updated_props.icon,
			color: updated_props.color,
			latitude: updated_props.latitude,
			longitude: updated_props.longitude,
		})

		return c.json({ message: 'Successfully updated waypoint!' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
