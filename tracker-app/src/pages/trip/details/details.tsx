import { useRouteLoaderData } from "react-router-dom"
import { Trip as TripResponse } from "tracker-server-client"

export const TripDetails = () => {
	const trip = useRouteLoaderData('trip') as TripResponse

	return <div className="trip-details">
		{JSON.stringify(trip)}
	</div>
}
