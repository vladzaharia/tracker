import { createTripApi } from '../api'

export default async function ListTripAdminLoader() {
	const tripApi = createTripApi()
	return (await tripApi.listTrips(true, true, true)).data
}
