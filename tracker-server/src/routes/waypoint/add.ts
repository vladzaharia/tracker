import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { WaypointTable } from '../../tables/db'
import { findWaypointInTrip, insertWaypoint } from '../../tables/waypoint'
import { findTrip } from '../../tables/trip'
import moment from 'moment'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AddWaypointBody extends Omit<WaypointTable, 'trip_id' | 'timestamp' | 'managed' | 'prominent'> {
	prominent: boolean
}

export const AddWaypoint = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE
		const { trip, timestamp } = c.req.param()
		const { name, color, icon, latitude, longitude, prominent } = await c.req.json<AddWaypointBody>()

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
		const timestampNum = parseInt(timestamp, 10)
		const timestampDate = moment(timestampNum)
		const record = await findWaypointInTrip(db, trip, timestampNum)
		if (record) {
			return c.json({ message: 'Waypoint already exists!' }, 400)
		}

		// Check that waypoint is in trip time range
		if (!(moment(tripRecord.start_date) < timestampDate && moment(tripRecord.end_date) > timestampDate)) {
			return c.json({ message: 'Waypoint must be in trip time range!' }, 400)
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
			prominent: prominent ? 1 : 0,
		})

		return c.json({ message: 'Successfully added waypoint!' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
