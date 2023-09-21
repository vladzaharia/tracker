import { kml } from '@tmcw/togeojson'
import { getTripKML } from '../inreach/kml'
import { DOMParser } from '@xmldom/xmldom'
import { Bindings } from '../bindings'
import moment from 'moment'
import { listTrips, updateTrip } from '../tables/trip'

export const FetchGeoJSON = async (env: Bindings, updateAll = false) => {
	const allTrips = await listTrips(env.D1DATABASE)
	let importedTrips = 0
	let skippedTrips = 0
	let importedPoints = 0

	for (const trip of allTrips) {
		if (updateAll || moment(trip.end_date).add(moment.duration(1, 'week')) > moment()) {
			const tripKML = await getTripKML(env, trip.id)
			const tripKMLString = await tripKML.text()
			const geojson = kml(new DOMParser().parseFromString(tripKMLString))

			const points = geojson.features.filter((f) => f.geometry?.type === 'Point')
			const track = geojson.features.filter((f) => f.geometry?.type === 'LineString')

			await env.GEOJSON.put(`${trip.id}-points`, JSON.stringify({ ...geojson, features: points }))
			await env.GEOJSON.put(`${trip.id}-track`, JSON.stringify({ ...geojson, features: track }))

			updateTrip(env.D1DATABASE, trip.id, { num_points: points.length })

			console.log(`${trip.id} imported successfully with ${points.length} points!`)
			importedTrips++
			importedPoints += points.length
		} else {
			console.log(`${trip.id} skipped as it ended ${moment(trip.end_date).fromNow()}!`)
			skippedTrips++
		}
	}

	console.log(`Imported ${importedTrips} trips with ${importedPoints} points, skipped ${skippedTrips} trips!`)
	return {
		imported: importedTrips,
		skipped: skippedTrips,
		points: importedPoints,
	}
}
