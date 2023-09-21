/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { Trip } from '../../types'
import { VelocityRegex, GetActivity } from '../../util/activity'
import moment from 'moment'
import { TripTable } from '../../tables/db'
import { listWaypointsForTrip } from '../../tables/waypoint'

export const GetTripWaypoints = async (c: Context<{ Bindings: Bindings }>, trip: TripTable) => {
	const waypoints = await listWaypointsForTrip(c.env.D1DATABASE, trip.id)

	return {
		waypoints:
			waypoints.length > 0
				? waypoints.map((wp) => {
						return { ...wp, managed: wp.managed === 1, prominent: wp.prominent === 1 }
				  })
				: [],
	}
}

export const ConvertTripDates = (trip: TripTable) => {
	return {
		...trip,
		start_date: moment(trip.start_date).toDate(),
		end_date: moment(trip.end_date).toDate(),
	}
}

export const ConvertTrip = async (
	c: Context<{ Bindings: Bindings }>,
	trip: TripTable,
	showStatus = false,
	showTotals = false,
	showCenterPoint = false
) => {
	const convertedTrip: Trip = ConvertTripDates(trip)

	return {
		...convertedTrip,
		num_waypoints: showTotals ? (await listWaypointsForTrip(c.env.D1DATABASE, trip.id)).length : undefined,
		...(showStatus ? await GetTripStatus(c, convertedTrip, showTotals, showCenterPoint) : {}),
	}
}

export const GetTripStatus = async (c: Context<{ Bindings: Bindings }>, tripDetails: Trip, showTotals = false, showCenterPoint = false) => {
	const jsonString = await c.env.GEOJSON.get(`${tripDetails.id}-points`)

	if (jsonString) {
		const points = JSON.parse(jsonString).features

		if (points.length === 0) {
			return {}
		}

		const lastPoint = points && points[points.length - 1]
		const velocityMatch = lastPoint?.properties?.Velocity?.match(VelocityRegex)
		const courseMatch = lastPoint?.properties?.Course?.match(/(\d{1,3}\.\d{2}) ° True/)

		const getCenterPoint = () => {
			// Check if trip is current
			if (moment(tripDetails.start_date) < moment() && moment(tripDetails.end_date) > moment()) {
				return {
					latitude: Number(lastPoint?.properties?.Latitude),
					longitude: Number(lastPoint?.properties?.Longitude),
				}
			}

			return {
				latitude: points.reduce((acc: number, point: any) => acc + Number(point.properties.Latitude), 0) / points.length,
				longitude: points.reduce((acc: number, point: any) => acc + Number(point.properties.Longitude), 0) / points.length,
			}
		}

		return {
			last_point: showTotals ? lastPoint : undefined,
			center_point: showCenterPoint ? getCenterPoint() : undefined,
			status: {
				activity: GetActivity(lastPoint, tripDetails),
				position: {
					latitude: Number(lastPoint?.properties?.Latitude),
					longitude: Number(lastPoint?.properties?.Longitude),
					timestamp: lastPoint?.properties?.timestamp,
					velocity: Number(velocityMatch && velocityMatch[1]),
					course: Number(courseMatch && courseMatch[1]),
				},
			},
		}
	} else {
		return {}
	}
}
