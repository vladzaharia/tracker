export type TripType = 'scuba' | 'road'

export interface Trip {
	name: string
	id: string
	emoji: string
	type: TripType
	start_date: Date
	end_date: Date
	time_zone: string
}
