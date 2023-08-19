import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { findTrip, insertTrip } from '../../tables/trip'
import { TripTable } from '../../tables/db'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AddTripBody extends Omit<TripTable, 'id'> {}

export const AddTrip = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE
		const { trip } = c.req.param()
		const { name, emoji, type, start_date, end_date, time_zone } = await c.req.json<AddTripBody>()

		// Check if params are passed in
		if (!name) {
			return c.json({ message: 'Must set `name`!' }, 400)
		}
		if (!emoji) {
			return c.json({ message: 'Must set `emoji`!' }, 400)
		}
		if (!type) {
			return c.json({ message: 'Must set `type`!' }, 400)
		}
		if (!start_date) {
			return c.json({ message: 'Must set `start_date`!' }, 400)
		}
		if (!end_date) {
			return c.json({ message: 'Must set `end_date`!' }, 400)
		}
		if (!time_zone) {
			return c.json({ message: 'Must set `time_zone`!' }, 400)
		}

		// Try to find trip
		const record = await findTrip(db, trip)
		if (record) {
			return c.json({ message: 'Trip already exists!' }, 400)
		}

		// Insert trip
		await insertTrip(db, {
			id: trip,
			name,
			emoji,
			type,
			start_date: start_date,
			end_date: end_date,
			time_zone,
		})

		return c.json({ message: 'Successfully added trip!' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
