export interface Trip {
	name: string
	id: AllTrips
	emoji: string
	type: TripType
	start_date: Date
	end_date: Date
	time_zone: string
}

export type TripType = 'scuba' | 'road'

export type AllTrips = 'mexico' | 'bahamas-2022' | 'bahamas-2024' | 'road-trip' | 'philippines' | 'test'
