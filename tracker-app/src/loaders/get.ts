import { Params } from 'react-router-dom'
import { createTrackerApi } from '../api'

export default async function GetTripLoader({ params }: { params: Params }) {
	const trackerApi = createTrackerApi()
	return (await trackerApi.getTrip(params.trip || '')).data
}
