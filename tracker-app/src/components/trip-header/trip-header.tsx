import { faRight } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment, { Moment } from 'moment'
import { BasicTrip, Trip as TripResponse } from 'tracker-server-client'
import { useLoaderData } from 'react-router-dom'

import './trip-header.css'

export const DateDuration = ({
	outdated,
	className,
	startDate,
	endDate,
}: {
	outdated: boolean
	className?: string
	startDate: Moment
	endDate: Moment
}) => {
	return (
		<div className={`date-duration ${className || ''}`}>
			<span className="date">{outdated ? startDate.format('MMM D, YYYY') : startDate.format('MMM D')}</span>
			<span className="icon">
				<FontAwesomeIcon icon={faRight} />
			</span>
			<span className="date">{outdated ? endDate.format('MMM D, YYYY') : endDate.format('MMM D')}</span>
		</div>
	)
}

export const TripHeader = ({ className, trip: tripProp, onClick }: { className?: string; trip?: BasicTrip; onClick?: () => void }) => {
	const tripLoader = useLoaderData() as TripResponse
	const trip = tripProp || tripLoader

	const startDate = moment(trip.start_date)
	const endDate = moment(trip.end_date)
	const outdated = endDate.year() !== moment().year()

	return (
		<div className={`trip-header ${onClick ? 'clickable' : ''} ${outdated ? 'past' : 'upcoming'}`} onClick={onClick}>
			<h1>
				<span className="mr-05">{trip.emoji}</span> {trip.name}
			</h1>
			<DateDuration outdated={outdated} className={className} startDate={startDate} endDate={endDate} />
		</div>
	)
}
