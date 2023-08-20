import { createWaypointApi } from '../api'

export default async function ListWaypointLoader() {
	const waypointApi = createWaypointApi()
	return (await waypointApi.listWaypoints()).data
}
