import { Trip } from '../types'
import { GetActivity, Point } from './activity'

const point: Point = {
	type: 'Feature',
	geometry: {
		coordinates: [1, 2, 3],
		type: 'Point'
	},
	properties: {
		visibility: true,
		Course: '0.0 deg',
		Velocity: '0.0 km/h',
		Latitude: '1.000000',
		Longitude: '2.000000',
		Elevation: '3.0 m MSL',
		Time: '2021-01-01 00:00:00',
		timestamp: '2021-01-01 00:00:00',
		"Time UTC": '2021-01-01 00:00:00'
	}
}

const trip: Trip = {
	id: 'test',
	name: 'Test trip',
	emoji: '🧪',
	type: 'scuba',
	start_date: new Date(2021,1,1,0,0,0),
	end_date: new Date(2021,1,1,1,0,0),
	time_zone: 'America/New_York',
}

describe('GetActivity', () => {
	test('returns activity', () => {
		const activity = GetActivity(point, trip, false)
		expect(activity).toBe('sleeping')
	})
})
