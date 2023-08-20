import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { listWaypoints } from '../../tables/waypoint'

export const ListWaypoints = async (c: Context<{ Bindings: Bindings }>) => {
	const waypoints = await listWaypoints(c.env.D1DATABASE)

	return c.json(
		{
			waypoints,
		},
		200
	)
}
