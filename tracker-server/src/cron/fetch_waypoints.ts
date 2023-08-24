import { Bindings } from '../bindings'
import { getWaypoints } from '../inreach/waypoint'
import { findWaypointInTrip, insertWaypoint, updateWaypoint } from '../tables/waypoint'

export const FetchWaypoints = async (env: Bindings, updateAll = false) => {
	const waypoints = await getWaypoints(env)
	let importedWaypoints = 0
	let updatedWaypoints = 0
	let skippedWaypoints = 0

	for (const waypoint of waypoints) {
		const foundWaypoint = await findWaypointInTrip(env.D1DATABASE, waypoint.trip_id, waypoint.timestamp)

		if (
			foundWaypoint &&
			(updateAll ||
				foundWaypoint.managed === 0 ||
				foundWaypoint.latitude !== waypoint.latitude ||
				foundWaypoint.longitude !== waypoint.longitude)
		) {
			console.log(`Waypoint ${waypoint.name} already exists in trip ${waypoint.trip_id}, updating it`)
			await updateWaypoint(env.D1DATABASE, waypoint.trip_id, waypoint.timestamp, {
				latitude: waypoint.latitude,
				longitude: waypoint.longitude,
				managed: 1,
			})
			updatedWaypoints++
		} else if (foundWaypoint) {
			console.log(`Waypoint ${waypoint.name} already exists in trip ${waypoint.trip_id} and is up to date`)
			skippedWaypoints++
		} else {
			await insertWaypoint(env.D1DATABASE, waypoint, true)
			console.log(`Waypoint ${waypoint.name} inserted in trip ${waypoint.trip_id}`)
			importedWaypoints++
		}
	}

	console.log(`Imported ${importedWaypoints} waypoints, updated ${updatedWaypoints} waypoints, skipped ${skippedWaypoints} waypoints!`)
	return { imported: importedWaypoints, updated: updatedWaypoints, skipped: skippedWaypoints }
}
