import moment from "moment-timezone"
import { Trip } from "../trips/types"

export type Activity = "diving" | "moving" | "stopped" | "sleeping" | "outdated" | "unknown"

export const VelocityRegex = /(\d{1,3}\.\d{1}) km\/h/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GetActivity = (point: any, trip: Trip) => {
	const velocityMatch = point?.properties?.Velocity?.match(VelocityRegex)
	const pointDate = moment(point?.properties?.timestamp).tz(trip.time_zone)

	// Check if point is outdated
	if (Math.abs(moment.duration(pointDate.diff(moment(Date.now()))).asHours()) > 8) {
		return "outdated"
	}

	if (velocityMatch && velocityMatch.length > 1) {
		const velocity = Number(velocityMatch[1])

		if (pointDate && (pointDate.hour() < 8 || pointDate.hour() > 22)) {
			return "sleeping"
		} else if (trip.type === "scuba" && velocity < 5) {
			return "diving"
		} else if (velocity === 0) {
			return "stopped"
		} else if (velocity > 3) {
			return "moving"
		}
	}

	return "unknown"
}

