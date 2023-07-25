import { Params } from 'react-router-dom'
import { createScubaApi } from '../api'

export default async function GetTripGeoJSONLoader({ params }: { params: Params }) {
	const trackerApi = createScubaApi()
	return (await trackerApi.getTripJSON(params.trip || '')).data
}
