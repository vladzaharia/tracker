import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { FetchInfo, findConfig } from '../../tables/config'
import { parseExpression } from 'cron-parser'
import moment from 'moment'

export const GetSync = async (c: Context<{ Bindings: Bindings }>) => {
	const usernameConfig = await findConfig(c.env.D1DATABASE, 'garmin_username')
	if (!usernameConfig || !usernameConfig.value) {
		return c.json({ message: 'Garmin username not found!' }, 404)
	}

	const lastFetchConfig = await findConfig(c.env.D1DATABASE, 'last_fetch_info')
	if (!lastFetchConfig || !lastFetchConfig.value) {
		return c.json({ message: 'Last fetch info not found!' }, 404)
	}

	const lastFetch = JSON.parse(lastFetchConfig.value) as FetchInfo

	const cron = lastFetch.cron?.schedule
		? parseExpression(lastFetch.cron?.schedule || '', {
				startDate: moment(lastFetch.cron?.last_run || undefined).toDate(),
		  })
		: undefined

	return c.json(
		{
			...JSON.parse(lastFetchConfig.value),
			cron: {
				...lastFetch.cron,
				next_run: cron?.next().toISOString(),
			},
			username: usernameConfig.value,
		},
		200
	)
}
