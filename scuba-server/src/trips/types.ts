export interface Trip {
	name: string
	id: AllTrips
	emoji: string
	type: TripType
	start_date: Date
	end_date: Date
}

export type TripType = 'scuba' | 'other'

export type AllTrips = 'mexico' | 'bahamas-2022' | 'road-trip' | 'philippines'
