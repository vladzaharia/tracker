import { createTripApi } from '../api'

export default async function ListTripLoader() {
	const tripApi = createTripApi()
	return (await tripApi.listTrips()).data
}
