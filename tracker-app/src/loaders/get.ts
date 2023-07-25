import { Params } from 'react-router-dom'
import { createScubaApi } from '../api'

export default async function GetTripLoader({ params }: { params: Params }) {
	const trackerApi = createScubaApi()
	return (await trackerApi.getTrip(params.trip || '')).data
}
