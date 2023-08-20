import { Params } from 'react-router-dom'
import { createTripApi } from '../api'

export default async function GetTripLoader({ params }: { params: Params }) {
	const tripApi = createTripApi()
	return (await tripApi.getTrip(params.trip || '')).data
}
