import { Context } from 'hono'
import { Bindings } from '../../../bindings'
import { findTrip } from '../../../tables/trip'
import { GetActivity, Point } from '../../../util/activity'
import { ConvertTripDates } from '../util'

export const GetTripGeoJSONPoints = async (c: Context<{ Bindings: Bindings }>) => {
	const { trip } = c.req.param()

	const tripDetails = await findTrip(c.env.D1DATABASE, trip)

	if (!tripDetails) {
		return c.json({ message: 'Trip not found!' }, 404)
	}

	const convertedTrip = ConvertTripDates(tripDetails)

	const jsonString = await c.env.GEOJSON.get(`${tripDetails.id}-points`)

	if (!jsonString) {
		return c.json({ message: 'Trip GeoJSON not found!' }, 404)
	}

	const parsedJson = JSON.parse(jsonString)

	if (parsedJson.features.length === 0) {
		return c.json({ message: 'Trip GeoJSON empty!' }, 404)
	}

	parsedJson.features = parsedJson.features.map((point: Point) => {
		return { ...point, properties: { ...point.properties, activity: GetActivity(point, convertedTrip, false) } }
	})

	return c.json(parsedJson, 200)
}
