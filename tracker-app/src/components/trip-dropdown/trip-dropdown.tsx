import { MenuItem, Select } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { createTripApi } from '../../api'
import { BasicTrip } from 'tracker-server-client'
import './trip-dropdown.css'
import { ContainerContext } from '../../hooks/container'

export const TripDropdown = ({ onChange }: { onChange: (value: string) => void }) => {
	const api = createTripApi()
	const [trips, setTrips] = useState<BasicTrip[]>()
	const [selected, setSelected] = useState<string>()
	const container = useContext(ContainerContext)

	const fetchTrips = async () => {
		const data = (await api.listTrips(false, false, false, false)).data

		setTrips([...(data.current ? [data.current] : []), ...data.past])
	}

	useEffect(() => {
		fetchTrips()
	}, [])

	return (
		<Select
			className="trip-dropdown"
			id="trips"
			value={selected}
			onChange={(e) => {
				setSelected(e.target.value)
				onChange(e.target.value)
			}}
			MenuProps={{
				PopoverClasses: {
					root: 'trip-dropdown-menu',
				},
				container: container?.current,
			}}
		>
			{trips?.map((trip) => {
				return (
					<MenuItem key={trip.id} value={trip.id}>
						{trip.emoji} {trip.name}
					</MenuItem>
				)
			})}
		</Select>
	)
}
