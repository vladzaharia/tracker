import { kml } from '@tmcw/togeojson'
import { getTripKML } from '../inreach'
import { getTrips } from '../util/trip'
import { DOMParser } from 'xmldom'
import { Bindings } from '../bindings'

export const FetchGeoJSON = async (env: Bindings) => {
	const allTrips = getTrips()

	for (const trip of allTrips) {
		try {
			const tripKML = await getTripKML(trip.id)
			const tripKMLString = await tripKML.text()
			const geojson = kml(new DOMParser().parseFromString(tripKMLString))

			const points = geojson.features.filter((f) => f.geometry?.type === 'Point')
			const track = geojson.features.filter((f) => f.geometry?.type === 'LineString')

			env.GEOJSON.put(`${trip.id}-points`, JSON.stringify({ ...geojson, features: points }))
			env.GEOJSON.put(`${trip.id}-track`, JSON.stringify({ ...geojson, features: track }))

			console.log(`${trip.id} imported successfully with ${points.length} points!`)
		} catch (e) {
			console.error(`Error while importing ${trip.id}: ${e}`)
		}
	}
}
