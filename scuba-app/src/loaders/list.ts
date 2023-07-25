import { createScubaApi } from '../api'

export default async function ListTripLoader() {
	const scubaApi = createScubaApi()
	return (await scubaApi.listTrips()).data
}
