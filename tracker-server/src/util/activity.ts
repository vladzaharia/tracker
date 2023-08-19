import moment from 'moment-timezone'
import { Trip } from '../types'

export type Activity = 'diving' | 'moving' | 'stopped' | 'sleeping' | 'outdated' | 'ended' | 'unknown'

export const VelocityRegex = /(\d{1,3}\.\d{1}) km\/h/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GetActivity = (point: any, trip: Trip) => {
	const velocityMatch = point?.properties?.Velocity?.match(VelocityRegex)
	const pointDate = moment(point?.properties?.timestamp).tz(trip.time_zone)

	// Check if trip has ended
	if (moment(trip.end_date) < moment()) {
		return 'ended'
	}

	// Check if point is outdated
	if (Math.abs(moment.duration(pointDate.diff(moment(Date.now()))).asHours()) > 8) {
		return 'outdated'
	}

	if (velocityMatch && velocityMatch.length > 1) {
		const velocity = Number(velocityMatch[1])

		if (pointDate && (pointDate.hour() < 6 || pointDate.hour() > 21)) {
			return 'sleeping'
		} else if (velocity === 0) {
			return 'stopped'
		} else if (trip.type === 'scuba' && velocity < 4) {
			return 'diving'
		} else if (velocity > 3) {
			return 'moving'
		}
	}

	return 'unknown'
}
