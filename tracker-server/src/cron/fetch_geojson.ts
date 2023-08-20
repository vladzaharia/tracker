import { kml } from '@tmcw/togeojson'
import { getTripKML } from '../inreach/kml'
import { DOMParser } from 'xmldom'
import { Bindings } from '../bindings'
import moment from 'moment'
import { listTrips } from '../tables/trip'

export const FetchGeoJSON = async (env: Bindings) => {
	const allTrips = await listTrips(env.D1DATABASE)

	for (const trip of allTrips) {
		if (moment(trip.end_date).add(moment.duration(1, 'week')) > moment()) {
			try {
				const tripKML = await getTripKML(env, trip.id)
				const tripKMLString = await tripKML.text()
				const geojson = kml(new DOMParser().parseFromString(tripKMLString))

				const points = geojson.features.filter((f) => f.geometry?.type === 'Point')
				const track = geojson.features.filter((f) => f.geometry?.type === 'LineString')

				await env.GEOJSON.put(`${trip.id}-points`, JSON.stringify({ ...geojson, features: points }))
				await env.GEOJSON.put(`${trip.id}-track`, JSON.stringify({ ...geojson, features: track }))

				console.log(`${trip.id} imported successfully with ${points.length} points!`)
			} catch (e) {
				console.error(`Error while importing ${trip.id}: ${e}`)
			}
		} else {
			console.log(`${trip.id} skipped as it ended ${moment(trip.end_date).fromNow()}!`)
		}
	}
}
