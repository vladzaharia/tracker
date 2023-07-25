import { Params } from 'react-router-dom'
import { createScubaApi } from '../api'

export default async function GetTripGeoJSONLoader({ params }: { params: Params }) {
	const scubaApi = createScubaApi()
	return (await scubaApi.getTripJSON(params.trip || '')).data
}
