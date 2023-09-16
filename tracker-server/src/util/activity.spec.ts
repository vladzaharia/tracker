import moment from 'moment'
import { Trip } from '../types'
import { GetActivity, Point } from './activity'

const point: Point = {
	type: 'Feature',
	geometry: {
		coordinates: [1, 2, 3],
		type: 'Point',
	},
	properties: {
		visibility: true,
		Course: '0.0 deg',
		Velocity: '0.0 km/h',
		Latitude: '1.000000',
		Longitude: '2.000000',
		Elevation: '3.0 m MSL',
		Time: '2021-01-01 12:00:00',
		timestamp: '2021-01-01 12:00:00',
		'Time UTC': '2021-01-01 12:00:00',
	},
}

const trip: Trip = {
	id: 'test',
	name: 'Test trip',
	emoji: '🧪',
	type: 'scuba',
	start_date: new Date(2021, 1, 1, 0, 0, 0),
	end_date: new Date(2021, 1, 1, 1, 0, 0),
	time_zone: 'GMT',
}

describe('GetActivity', () => {
	test('returns activity', () => {
		const activity = GetActivity(point, trip, false)
		expect(activity).toBe('stopped')
	})
	test('ended trip', () => {
		const activity = GetActivity(point, trip, true)
		expect(activity).toBe('ended')
	})
	test('outdated point', () => {
		const localPoint: Point = {
			...point,
			properties: {
				...point.properties,
				timestamp: moment().subtract(1, 'day').toISOString(),
			},
		}
		const localTrip: Trip = {
			...trip,
			end_date: moment().add(1, 'day').toDate(),
		}

		const activity = GetActivity(localPoint, localTrip, true)
		expect(activity).toBe('outdated')
	})
	test('sleeping', () => {
		const localPoint: Point = {
			...point,
			properties: {
				...point.properties,
				timestamp: '2021-01-01 00:00:00',
			},
		}

		const activity = GetActivity(localPoint, trip, false)
		expect(activity).toBe('sleeping')
	})
	test('sleeping with non-diving trip', () => {
		const localPoint: Point = {
			...point,
			properties: {
				...point.properties,
				timestamp: '2021-01-01 00:00:00',
			},
		}

		const localTrip: Trip = {
			...trip,
			type: 'road',
		}

		const activity = GetActivity(localPoint, localTrip, false)
		expect(activity).toBe('sleeping')
	})
	test('diving', () => {
		const localPoint: Point = {
			...point,
			properties: {
				...point.properties,
				Velocity: '3.9 km/h',
			},
		}

		const activity = GetActivity(localPoint, trip, false)
		expect(activity).toBe('diving')
	})
	test('diving does not show up on non-diving trip', () => {
		const localPoint: Point = {
			...point,
			properties: {
				...point.properties,
				Velocity: '3.9 km/h',
			},
		}

		const localTrip: Trip = {
			...trip,
			type: 'road',
		}

		const activity = GetActivity(localPoint, localTrip, false)
		expect(activity).not.toBe('diving')
	})
	test('moving', () => {
		const localPoint: Point = {
			...point,
			properties: {
				...point.properties,
				Velocity: '4.9 km/h',
			},
		}

		const activity = GetActivity(localPoint, trip, false)
		expect(activity).toBe('moving')
	})
	test('moving with other trip type', () => {
		const localPoint: Point = {
			...point,
			properties: {
				...point.properties,
				Velocity: '4.9 km/h',
			},
		}

		const localTrip: Trip = {
			...trip,
			type: 'road',
		}

		const activity = GetActivity(localPoint, localTrip, false)
		expect(activity).toBe('moving')
	})
})
