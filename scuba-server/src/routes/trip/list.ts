import { Context } from 'hono'
import { getTrips } from '../../trips'

export const ListTrips = async (c: Context) => {
	return c.json(
		{
			message: getTrips().map((t) => {
				return {
					id: t.id,
					name: t.name
				}
			})
		},
		200
	)
}
