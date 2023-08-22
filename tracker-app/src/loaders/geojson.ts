/* eslint-disable @typescript-eslint/no-explicit-any */
import { Params } from 'react-router-dom'
import { createInfoApi, createTripApi } from '../api'

export default async function GetTripGeoJSONLoader({ params }: { params: Params }) {
	try {
		const tripApi = createTripApi()
		const infoApi = createInfoApi()

		return {
			mapbox: {
				token: (await infoApi.getConfigValue('mapbox_access_token')).data,
			},
			points: (await tripApi.getTripJSONPoints(params.trip || '')).data,
			track: (await tripApi.getTripJSONTrack(params.trip || '')).data,
		} as TripGeoJSON
	} catch {
		return null
	}
}

export interface TripGeoJSON {
	points: any
	track: any
	mapbox: {
		token: string
	}
}
