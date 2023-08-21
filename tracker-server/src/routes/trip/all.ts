import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { listTrips } from '../../tables/trip'

export const ListTripInfo = async (c: Context<{ Bindings: Bindings }>) => {
	const trips = await listTrips(c.env.D1DATABASE)

	return c.json(
		{
			trips
		},
		200
	)
}
