import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { findConfig, updateLastFetchInfo } from '../../tables/config'
import { FetchGeoJSON } from '../../cron/fetch_geojson'
import { FetchWaypoints } from '../../cron/fetch_waypoints'
import moment from 'moment'

export const RunSync = async (c: Context<{ Bindings: Bindings }>) => {
	const { updateAll } = c.req.query()

	const usernameConfig = await findConfig(c.env.D1DATABASE, 'garmin_username')
	if (!usernameConfig || !usernameConfig.value) {
		return c.json({ message: 'Garmin username not found!' }, 404)
	}

	const lastFetchConfig = await findConfig(c.env.D1DATABASE, 'last_fetch_info')
	if (!lastFetchConfig || !lastFetchConfig.value) {
		return c.json({ message: 'Last fetch info not found!' }, 404)
	}

	try {
		await ExecuteSync(c.env, JSON.parse(lastFetchConfig.value).cron.schedule, 'manual', updateAll === 'true')
	} catch (e) {
		return c.json(
			{
				message: 'Something went wrong!',
			},
			500
		)
	}

	return c.json(
		{
			message: 'Sync ran successfully!',
		},
		200
	)
}

export const ExecuteSync = async (env: Bindings, schedule: string, reason: 'schedule' | 'manual', updateAll = false) => {
	const trips = await FetchGeoJSON(env, updateAll)
	const waypoints = await FetchWaypoints(env, updateAll)
	await updateLastFetchInfo(env.D1DATABASE, { cron: { last_run: moment().toISOString(), schedule, reason }, trips, waypoints })
}
