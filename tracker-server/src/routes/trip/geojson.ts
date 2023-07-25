import { Context } from 'hono'
import { getTrip } from '../../trips'
import { AllTrips } from '../../trips/types'
import { kml } from "@tmcw/togeojson";
import { DOMParser } from "xmldom"
import { getTripKML } from '../../inreach'

export const GetTripGeoJSON = async (c: Context) => {
	const { trip } = c.req.param()

	const tripDetails = getTrip(trip as AllTrips)

	if (!tripDetails) {
		return c.json({ message: "Trip not found!" }, 404)
	}

	const tripKML = await getTripKML(tripDetails.id)
	const tripKMLString = await tripKML.text()
	const geojson = kml(new DOMParser().parseFromString(tripKMLString))

	return c.json(
		geojson,
		200
	)
}
