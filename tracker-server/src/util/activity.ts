import moment from 'moment-timezone'
import { Trip } from '../types'

export type Activity = 'diving' | 'moving' | 'stopped' | 'sleeping' | 'outdated' | 'ended' | 'unknown'

export const VelocityRegex = /(\d{1,3}\.\d{1}) km\/h/

export interface Point {
	type: string
	geometry: {
		type: string
		coordinates: number[]
	}
	properties: {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GetActivity = (point: Point, trip: Trip, showTimeBasedStatuses = true) => {
	const velocityMatch = point?.properties?.Velocity?.match(VelocityRegex)
	const pointDate = moment.tz(point?.properties?.timestamp, trip.time_zone)

	if (showTimeBasedStatuses) {
		// Check if trip has ended
		if (trip && moment(trip.end_date) < moment()) {
			return 'ended'
		}

		// Check if point is outdated
		if (Math.abs(moment.duration(pointDate.diff(moment(Date.now()))).asHours()) > 8) {
			return 'outdated'
		}
	}

	if (velocityMatch && velocityMatch.length > 1) {
		const velocity = Number(velocityMatch[1])

		if (pointDate && (pointDate.hour() < 6 || pointDate.hour() > 21)) {
			return 'sleeping'
		} else if (velocity < 1) {
			return 'stopped'
		} else if (trip.type === 'scuba' && velocity < 4) {
			return 'diving'
		} else if (velocity > 3) {
			return 'moving'
		}
	}

	return 'unknown'
}
