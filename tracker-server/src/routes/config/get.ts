import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { findConfig } from '../../tables/config'

export const GetConfig = async (c: Context<{ Bindings: Bindings }>) => {
	const { id } = c.req.param()

	const config = await findConfig(c.env.D1DATABASE, id)

	if (!config) {
		return c.json({ message: 'Config not found!' }, 404)
	}

	return c.text(config.value, 200)
}
