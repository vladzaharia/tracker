import { IconDefinition } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouteLoaderData } from 'react-router-dom'
import { Trip, TripStatusActivityEnum } from 'tracker-server-client'

import './point-popup.css'
import { getColor, getIcon, getTitle } from '../trip-status/activity'
import moment from 'moment-timezone'

export interface Point {
	type: string
	geometry: {
		type: string
		coordinates: number[]
	}
	properties: {
		activity: TripStatusActivityEnum
		visibility: boolean
		'Time UTC': string
		Time: string
		Latitude: string
		Longitude: string
		Elevation: string
		Velocity: string
		Course: string
		timestamp: string
	}
}

export const PointPopup = ({ point }: { point: Point }) => {
	const trip = useRouteLoaderData('trip') as Trip

	const courseMatch = point.properties.Course.match(/(\d{1,3}\.\d{2}) ° True/)
	const course = parseInt((courseMatch && courseMatch[1]) || '90', 10)

	const velocityMatch = point.properties.Velocity.match(/(\d{1,3}\.\d{1}) km\/h/)
	const velocity = parseInt((velocityMatch && velocityMatch[1]) || '0', 10)

	return (
		<div className="point-popup">
			<div className="point-popup-left">
				<div className="point-popup-position">
					<span>{point?.properties.Latitude}</span>
					<span>{point?.properties.Longitude}</span>
				</div>

				<span className="point-popup-time">{moment(point.properties.timestamp).tz(trip.time_zone).format('MMM D, YYYY h:mm A')}</span>
			</div>

			<div className={`point-popup-right ${getColor(point.properties.activity)}`}>
				<span className="activity-icon">
					<FontAwesomeIcon icon={getIcon(point.properties.activity, course) as IconDefinition} size="4x" />
				</span>
				<span className="activity-text-wrapper">
					<span className="activity-title">{getTitle(point.properties.activity, trip.type, velocity)}</span>
				</span>
			</div>
		</div>
	)
}
