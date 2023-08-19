import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { deleteTrip, findTrip } from '../../tables/trip'

export const DeleteTrip = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE
		const { trip } = c.req.param()

		// Try to find trip
		const record = await findTrip(db, trip)
		if (!record) {
			return c.json({ message: 'Trip not found!' }, 404)
		}

		// Delete trip
		await deleteTrip(db, trip)

		return c.json({ message: 'Successfully deleted trip!' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
