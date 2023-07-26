import { faRight } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment, { Moment } from 'moment'
import { BasicTrip, Trip as TripResponse } from 'tracker-server-client'
import { useLoaderData } from 'react-router-dom'

import './trip-header.css'

export const DateDuration = ({
	otherYear,
	className,
	startDate,
	endDate,
}: {
	otherYear: boolean
	className?: string
	startDate: Moment
	endDate: Moment
}) => {
	return (
		<div className={`date-duration ${className || ''}`}>
			<span className="date">{otherYear ? startDate.format('MMM D, YYYY') : startDate.format('MMM D')}</span>
			<span className="icon">
				<FontAwesomeIcon icon={faRight} />
			</span>
			<span className="date">{otherYear ? endDate.format('MMM D, YYYY') : endDate.format('MMM D')}</span>
		</div>
	)
}

export const TripHeader = ({ className, trip: tripProp, onClick }: { className?: string; trip?: BasicTrip; onClick?: () => void }) => {
	const tripLoader = useLoaderData() as TripResponse
	const trip = tripProp || tripLoader

	const startDate = moment(trip.start_date)
	const endDate = moment(trip.end_date)
	const otherYear = endDate.year() !== moment().year()
	const upcoming = startDate > moment()

	return (
		<div className={`trip-header ${onClick ? 'clickable' : ''} ${upcoming ? 'upcoming' : 'past'}`} onClick={onClick}>
			<h1>
				<span className="mr-1">{trip.emoji}</span> {trip.name}
			</h1>
			<DateDuration otherYear={otherYear} className={className} startDate={startDate} endDate={endDate} />
		</div>
	)
}
