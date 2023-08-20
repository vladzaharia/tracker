/* eslint-disable @typescript-eslint/no-explicit-any */
import { Params } from 'react-router-dom'
import { createTripApi } from '../api'

export default async function GetTripGeoJSONLoader({ params }: { params: Params }) {
	try {
		const tripApi = createTripApi()

		return {
			points: (await tripApi.getTripJSONPoints(params.trip || '')).data,
			track: (await tripApi.getTripJSONTrack(params.trip || '')).data,
		}
	} catch {
		return null
	}
}

export interface TripGeoJSON {
	points: any
	track: any
}
