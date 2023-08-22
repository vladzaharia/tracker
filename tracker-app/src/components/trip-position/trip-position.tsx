import { faGauge, faLocationArrow } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment-timezone'
import { Trip } from 'tracker-server-client'
import { useLoaderData } from 'react-router-dom'

import './trip-position.css'
import Action from '../action/action'

export const TripPosition = ({ trip: tripProp, className }: { className?: string; trip?: Trip }) => {
	const tripLoader = useLoaderData() as Trip
	const trip = tripProp || tripLoader

	return (
		<div className="trip-position-wrapper">
			<div className={`trip-position ${className || ''}`}>
				<span className="coordinates">
					{trip.status.position.latitude}, {trip.status.position.longitude}
				</span>

				<Action
					text={
						<>
							<FontAwesomeIcon className="mr-05" icon={faGauge} /> Speed
						</>
					}
				>
					<span>
						<span className="fw-500">{trip.status.position.velocity}</span> km/h
					</span>
				</Action>
				<Action
					text={
						<>
							<FontAwesomeIcon className="mr-05" icon={faLocationArrow} /> Course
						</>
					}
				>
					<span>
						<span className="fw-500">{trip.status.position.course}</span> °
					</span>
				</Action>
			</div>
			<div className="timestamp">
				<span className="pretty">
					<span className="mr-0125">Updated</span> <span className="fw-500">{moment(trip.status.position.timestamp).fromNow()}</span>
				</span>
				<span className="full">{moment(trip.status.position.timestamp).tz(trip.time_zone).format('MMM D, YYYY h:mm A')}</span>
				<span className="tz">
					{trip.time_zone} ({moment(trip.status.position.timestamp).tz(trip.time_zone).format('Z')})
				</span>
			</div>
		</div>
	)
}
