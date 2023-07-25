/* eslint-disable @typescript-eslint/no-explicit-any */
import { Params } from 'react-router-dom'
import { createTrackerApi } from '../api'

export default async function GetTripGeoJSONLoader({ params }: { params: Params }) {
	const trackerApi = createTrackerApi()

	return {
		points: (await trackerApi.getTripJSONPoints(params.trip || '')).data,
		track: (await trackerApi.getTripJSONTrack(params.trip || '')).data,
	}
}

export interface TripGeoJSON {
	points: any
	track: any
}
