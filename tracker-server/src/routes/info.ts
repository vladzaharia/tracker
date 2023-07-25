import { Context } from 'hono'

export const Info = async (c: Context) => {
	return c.json(
		{
			message: "ok"
		},
		200
	)
}
