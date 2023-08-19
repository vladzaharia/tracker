import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { findTrip, updateTrip } from '../../tables/trip'
import { TripTable } from '../../tables/db'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UpdateTripBody extends Omit<TripTable, 'id'> {}

export const UpdateTrip = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE
		const { trip } = c.req.param()
		const updated_props = await c.req.json<UpdateTripBody>()

		// Check if any keys are set
		if (Object.keys(updated_props).length === 0) {
			return c.json({ message: 'Must set at least one property!' }, 400)
		}

		// Try to find trip
		const record = await findTrip(db, trip)
		if (!record) {
			return c.json({ message: 'Trip not found!' }, 404)
		}

		// Update trip
		await updateTrip(db, trip, {
			name: updated_props.name,
			emoji: updated_props.emoji,
			type: updated_props.type,
			start_date: updated_props.start_date,
			end_date: updated_props.end_date,
			time_zone: updated_props.time_zone,
		})

		return c.json({ message: 'Successfully updated trip!' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
