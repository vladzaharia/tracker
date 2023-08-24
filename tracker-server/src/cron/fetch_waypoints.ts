import { Bindings } from '../bindings'
import { getWaypoints } from '../inreach/waypoint'
import { findWaypointInTrip, insertWaypoint, updateWaypoint } from '../tables/waypoint'

export const FetchWaypoints = async (env: Bindings) => {
	const waypoints = await getWaypoints(env)

	for (const waypoint of waypoints) {
		const foundWaypoint = await findWaypointInTrip(env.D1DATABASE, waypoint.trip_id, waypoint.timestamp)

		if (foundWaypoint) {
			console.log(`Waypoint ${waypoint.name} already exists in trip ${waypoint.trip_id}, ensuring it's up to date`)
			await updateWaypoint(env.D1DATABASE, waypoint.trip_id, waypoint.timestamp, {
				latitude: waypoint.latitude,
				longitude: waypoint.longitude,
				managed: 1,
			})
		} else {
			await insertWaypoint(env.D1DATABASE, waypoint, true)
			console.log(`Waypoint ${waypoint.name} inserted in trip ${waypoint.trip_id}`)
		}
	}
}
