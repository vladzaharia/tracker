import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { listConfig } from '../../tables/config'

export const ListConfigs = async (c: Context<{ Bindings: Bindings }>) => {
	const configs = await listConfig(c.env.D1DATABASE)

	return c.json(
		{
			configs: configs.map((c) => {
				return {
					...c,
					value: c.secret !== 1 ? c.value : undefined,
					editable: c.editable === 1,
					secret: c.secret === 1
				}
			}),
		},
		200
	)
}
