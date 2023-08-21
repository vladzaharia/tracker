import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { findConfig, updateConfigValue } from '../../tables/config'

interface UpdateConfigBody {
	[key: string]: string
}

export const UpdateConfig = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE
		const { id } = c.req.param()
		const { value } = await c.req.json<UpdateConfigBody>()

		// Check that value was passed in
		if (!value || value.length === 0) {
			return c.json({ message: 'Value is required!' }, 400)
		}

		// Try to find config
		const record = await findConfig(db, id)
		if (!record) {
			return c.json({ message: 'Config not found!' }, 404)
		}

		// Check if config is editable
		if (!record.editable) {
			return c.json({ message: `${record.id} is not editable via API!` }, 403)
		}

		// Update config value
		await updateConfigValue(db, id, value)

		return c.json({ message: 'Successfully updated config!' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
