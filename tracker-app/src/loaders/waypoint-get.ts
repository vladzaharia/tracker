import { Params } from 'react-router-dom'
import { createWaypointApi } from '../api'

export default async function GetWaypointLoader({ params }: { params: Params }) {
	const waypointApi = createWaypointApi()
	return (await waypointApi.getWaypoint(params.trip || '', parseInt(params.timestamp || '0', 10))).data
}
