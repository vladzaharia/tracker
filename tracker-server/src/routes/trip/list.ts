import { Context } from 'hono'
import { getTrips } from '../../util/trip'
import { Bindings } from '../../bindings'

export const ListTrips = async (c: Context<{ Bindings: Bindings }>) => {
	return c.json(
		{
			message: getTrips().map((t) => {
				return {
					id: t.id,
					name: t.name,
				}
			}),
		},
		200
	)
}
