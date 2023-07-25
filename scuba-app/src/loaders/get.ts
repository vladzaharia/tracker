import { Params } from 'react-router-dom'
import { createScubaApi } from '../api'

export default async function GetTripLoader({ params }: { params: Params }) {
	const scubaApi = createScubaApi()
	return (await scubaApi.getTrip(params.trip || '')).data
}
