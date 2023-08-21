import { faGauge, faLocationArrow } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import { Trip } from 'tracker-server-client'
import { useLoaderData } from 'react-router-dom'

import './trip-position.css'
import Action from '../action/action'

export const TripPosition = ({
	trip: tripProp,
	className,
	fullTimestamp,
}: {
	className?: string
	trip?: Trip
	fullTimestamp?: boolean
}) => {
	const tripLoader = useLoaderData() as Trip
	const trip = tripProp || tripLoader

	return (
		<div className="trip-position-wrapper">
			<div className={`trip-position ${className || ''}`}>
				{fullTimestamp ? (
					<Action text="Timestamp">
						<span>{moment(trip.status.position.timestamp).format('MMM D, YYYY h:mm A')}</span>
					</Action>
				) : undefined}

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
			<span className="timestamp">
				{!fullTimestamp ? (
					<>
						<span className="mr-025">Updated</span> <span className="fw-500">{moment(trip.status.position.timestamp).fromNow()}</span>
					</>
				) : undefined}
			</span>
		</div>
	)
}
