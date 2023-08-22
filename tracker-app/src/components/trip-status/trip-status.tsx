import { IconDefinition } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLoaderData } from 'react-router-dom'
import { Trip } from 'tracker-server-client'

import './trip-status.css'
import { getColor, getIcon, getTitle, getDescription } from './activity'

export const TripStatus = ({ trip: tripProp }: { trip?: Trip }) => {
	const tripLoader = useLoaderData() as Trip
	const trip = tripProp || tripLoader

	return (
		<div className={`trip-status ${getColor(trip.status.activity)}`}>
			<span className="activity-icon">
				<FontAwesomeIcon icon={getIcon(trip.status.activity, trip.status.position.course) as IconDefinition} size="4x" />
			</span>
			<span className="activity-text-wrapper">
				<span className="activity-title">{getTitle(trip.status.activity, trip.type, trip.status.position.velocity)}</span>
				<span className="activity-description">
					{getDescription(trip.status.activity, trip.type, trip.status.position.course, trip.time_zone)}
				</span>
			</span>
		</div>
	)
}
