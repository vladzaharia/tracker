import { createTrackerApi } from '../api'

export default async function ListTripLoader() {
	const trackerApi = createTrackerApi()
	return (await trackerApi.listTrips()).data
}
