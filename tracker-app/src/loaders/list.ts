import { createScubaApi } from '../api'

export default async function ListTripLoader() {
	const trackerApi = createScubaApi()
	return (await trackerApi.listTrips()).data
}
