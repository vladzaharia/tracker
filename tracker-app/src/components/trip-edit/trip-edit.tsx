import { faChevronLeft, faMaskSnorkel, faVanShuttle, faPlus, faCheck, faSquareQuestion } from '@fortawesome/pro-solid-svg-icons'
import { ButtonGroup, MenuItem, Select } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import moment from 'moment'
import Action from '../action/action'
import Header from '../header/header'
import { useState } from 'react'
import { useAuth } from 'react-oidc-context'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { createAdminApi } from '../../api'
import { useNotificationAwareRequest } from '../../hooks/notification'
import useReload from '../../hooks/reload'
import { Trip } from 'tracker-server-client'
import Button from '../button/button'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import './trip-edit.css'
import timezones from 'timezones-list'

export const TripEdit = ({ inModal, onModalClose }: { inModal?: boolean; onModalClose?: () => void }) => {
	const trip = useLoaderData() as Trip
	useReload(trip)
	const navigate = useNavigate()
	const request = useNotificationAwareRequest()
	const auth = useAuth()

	const api = createAdminApi(auth.user?.access_token || '')
	const [id, setId] = useState(trip.id || '')
	const [name, setName] = useState(trip.name || '')
	const [emoji, setEmoji] = useState(trip.emoji || '')
	const [type, setType] = useState(trip.type || '')
	const [startDate, setStartDate] = useState(trip.start_date ? moment(trip.start_date) : moment())
	const [endDate, setEndDate] = useState(trip.end_date ? moment(trip.end_date) : moment())
	const [timeZone, setTimeZone] = useState(trip.time_zone || '')

	const addTrip = async () => {
		await request(
			() =>
				api.addTrip(id, {
					name,
					emoji,
					type,
					start_date: startDate.unix() * 1000,
					end_date: endDate.unix() * 1000,
					time_zone: timeZone,
				}),
			undefined,
			() => onModalClose && onModalClose()
		)
	}

	const updateTrip = async () => {
		await request(() =>
			api.updateTrip(trip.id, {
				name,
				emoji,
				type,
				start_date: startDate.unix() * 1000,
				end_date: endDate.unix() * 1000,
				time_zone: timeZone,
			})
		)
		navigate('/admin/trip')
	}

	return (
		<LocalizationProvider dateAdapter={AdapterMoment}>
			<div className="trip-edit">
				{!inModal ? (
					<Header
						title={
							<>
								<span className="mr-05">{trip.emoji}</span> {trip.name}
							</>
						}
						color="blue"
						className="corner-right"
						leftActions={<Button color="blue" onClick={() => navigate(`/admin/trip`)} iconProps={{ icon: faChevronLeft }} />}
						rightActions={<Button color="green" onClick={() => updateTrip()} iconProps={{ icon: faCheck }} />}
					/>
				) : (
					<Action className="trip-edit-input" text="ID" description="Unique ID for this trip.">
						<div className="input-wrapper">
							<input type="text" value={id} onChange={(e) => setId(e.currentTarget.value)} />
						</div>
					</Action>
				)}

				<Action className="trip-edit-input" text="Name" description="Display name for this trip.">
					<div className="input-wrapper">
						<input type="text" value={name} onChange={(e) => setName(e.currentTarget.value)} />
					</div>
				</Action>
				<Action className="trip-edit-input" text="Emoji" description="Emoji for this trip.">
					<div className="input-wrapper">
						<input type="text" value={emoji} onChange={(e) => setEmoji(e.currentTarget.value)} />
					</div>
				</Action>
				<Action className="trip-edit-input" text="Type" description="Type of trip.">
					<ButtonGroup className="button-group">
						<Button color={type === 'scuba' ? 'green' : 'blue'} iconProps={{ icon: faMaskSnorkel }} onClick={() => setType('scuba')} />
						<Button color={type === 'road' ? 'green' : 'blue'} iconProps={{ icon: faVanShuttle }} onClick={() => setType('road')} />
						<Button color={type === 'other' ? 'green' : 'blue'} iconProps={{ icon: faSquareQuestion }} onClick={() => setType('other')} />
					</ButtonGroup>
				</Action>
				<Action className="trip-edit-input" text="Start date" description="Date this trip starts on.">
					<DatePicker
						className="trip-edit-date-picker"
						defaultValue={inModal ? moment(trip.start_date) : undefined}
						value={!inModal ? moment(trip.start_date) : undefined}
						onChange={(v) => v && setStartDate(v)}
					/>
				</Action>
				<Action className="trip-edit-input" text="End date" description="Date this trip ends on.">
					<DatePicker
						className="trip-edit-date-picker"
						defaultValue={inModal ? moment(trip.end_date) : undefined}
						value={!inModal ? moment(trip.end_date) : undefined}
						onChange={(v) => v && setEndDate(v)}
					/>
				</Action>
				<Action className="trip-edit-input" text="Time zone" description="Time zone this trip runs on.">
					<div className="input-wrapper">
						<Select
							className="timezone-select"
							id="timezone"
							value={!inModal ? timeZone : undefined}
							defaultValue={inModal ? 'America/Los_Angeles' : undefined}
							// label="Time zone"
							onChange={(e) => setTimeZone(e.target.value)}
						>
							{timezones.map((tz) => {
								return (
									<MenuItem key={tz.tzCode} value={tz.tzCode}>
										{tz.label}
									</MenuItem>
								)
							})}
						</Select>
					</div>
				</Action>
				{inModal ? (
					<Action className="action-button">
						<Button color="green" iconProps={{ icon: faPlus }} text="Create" onClick={() => addTrip()} />
					</Action>
				) : undefined}
			</div>
		</LocalizationProvider>
	)
}
