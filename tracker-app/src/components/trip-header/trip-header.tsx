import { faRight } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import { Trip as TripResponse } from 'tracker-server-client'
import { useLoaderData } from 'react-router-dom'

import './trip-header.css'

export const TripHeader = ({ className }: { className?: string }) => {
	const trip = useLoaderData() as TripResponse

	const startDate = moment(trip.start_date)
	const endDate = moment(trip.end_date)
	const outdated = endDate.year() !== moment().year()

	return (
		<div className="trip-header">
			<h1>
				<span className="mr-05">{trip.emoji}</span> {trip.name}
			</h1>
			<div className={`date-duration ${className || ''}`}>
				<span className="date">
					{outdated ? (
						<span className="large">{startDate.format('MMM D, YYYY')}</span>
					) : (
						<span className="larger">{startDate.format('MMM D')}</span>
					)}
				</span>
				<span className="icon">
					<FontAwesomeIcon icon={faRight} />
				</span>
				<span className="date">
					{outdated ? (
						<span className="large">{endDate.format('MMM D, YYYY')}</span>
					) : (
						<span className="larger">{endDate.format('MMM D')}</span>
					)}
				</span>
			</div>
		</div>
	)
}
