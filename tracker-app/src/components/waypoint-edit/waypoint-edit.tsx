import { faChevronLeft, faCheck, IconName, faCircle, faMapMarkerAlt, faPlus } from '@fortawesome/pro-solid-svg-icons'
import moment from 'moment'
import Action from '../action/action'
import Header from '../header/header'
import { useState } from 'react'
import { useAuth } from 'react-oidc-context'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { createAdminApi } from '../../api'
import { useNotificationAwareRequest } from '../../hooks/notification'
import useReload from '../../hooks/reload'
import { Waypoint, WaypointColor } from 'tracker-server-client'
import Button from '../button/button'
import './waypoint-edit.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CommonColor, CommonColorAlt } from '../../types'
import { AddToLibrary, AVAILABLE_ICONS } from '../icons/icons'
import Pill from '../pill/pill'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { TripDropdown } from '../trip-dropdown/trip-dropdown'
import Toggle from '../toggle/toggle'

export const WaypointEdit = ({ inModal, onModalClose }: { inModal?: boolean; onModalClose?: () => void }) => {
	const waypoint = useLoaderData() as Waypoint
	useReload(waypoint)
	const navigate = useNavigate()
	const request = useNotificationAwareRequest()
	const auth = useAuth()
	const api = createAdminApi(auth.user?.access_token || 'someaccesstoken')

	const [tripId, setTripId] = useState(waypoint.trip_id || '')
	const [timestamp, setTimestamp] = useState(moment(waypoint.timestamp) || '')
	const [name, setName] = useState(waypoint.name || '')
	const [icon, setIcon] = useState<string | null>(waypoint.icon || '')
	const [color, setColor] = useState<string | null>(waypoint.color || '')
	const [latitude, setLatitude] = useState(waypoint.latitude ? waypoint.latitude.toString() : '')
	const [longitude, setLongitude] = useState(waypoint.longitude ? waypoint.longitude.toString() : '')
	const [prominent, setProminent] = useState(waypoint.prominent)

	const addWaypoint = async () => {
		await request(
			() =>
				api.addWaypoint(tripId, timestamp.unix() * 1000, {
					name,
					icon: icon || undefined,
					color: (color as WaypointColor) || undefined,
					latitude: parseFloat(latitude),
					longitude: parseFloat(longitude),
					prominent,
				}),
			{
				icon: faMapMarkerAlt,
				message: 'Successfully created waypoint!',
			},
			() => onModalClose && onModalClose()
		)
	}

	const updateWaypoint = async () => {
		await request(
			() =>
				api.updateWaypoint(waypoint.trip_id, waypoint.timestamp, {
					name,
					icon: icon || undefined,
					color: (color as WaypointColor) || undefined,
					latitude: !waypoint.managed ? parseFloat(latitude) : undefined,
					longitude: !waypoint.managed ? parseFloat(longitude) : undefined,
					prominent,
				}),
			{
				icon: faMapMarkerAlt,
				message: 'Successfully updated waypoint!',
			},
			() => navigate('/admin/waypoint')
		)
	}

	AddToLibrary()

	const IconSelector = () => {
		return (
			<div className="icons">
				{AVAILABLE_ICONS.map((i) => (
					<Pill
						key={i.iconName}
						color="green"
						className={i.iconName === icon ? 'active' : undefined}
						text={<FontAwesomeIcon icon={i} />}
						onClick={() => setIcon(i.iconName === icon ? null : i.iconName)}
					/>
				))}
			</div>
		)
	}

	const ColorSelector = () => {
		const colors: (CommonColor | CommonColorAlt)[] = [
			'primary',
			'blue',
			'green',
			'red',
			'purple',
			'yellow',
			'orange',
			'grey-dark',
			'primary alt',
			'blue alt',
			'green alt',
			'red alt',
			'purple alt',
			'yellow alt',
			'orange alt',
		]
		return (
			<div className="icons">
				{colors.map((c) => (
					<Pill
						key={c}
						color={c as CommonColor}
						className={c === color ? 'active' : undefined}
						text={<FontAwesomeIcon icon={faCircle} />}
						onClick={() => setColor(c)}
					/>
				))}
			</div>
		)
	}

	return (
		<LocalizationProvider dateAdapter={AdapterMoment}>
			<div className="waypoint-admin">
				{!inModal ? (
					<Header
						title={waypoint.name}
						color="green"
						className="corner-right"
						leftActions={<Button color="green" onClick={() => navigate(`/admin/waypoint`)} iconProps={{ icon: faChevronLeft }} />}
						rightActions={
							<Button
								color="green"
								onClick={() => updateWaypoint()}
								iconProps={{ icon: faCheck }}
								popoverProps={{ color: 'green', description: 'Save changes' }}
							/>
						}
					/>
				) : undefined}

				<Action className="waypoint-admin-input" text="Trip" description="Trip this waypoint is associated with.">
					{inModal ? (
						<div className="input-wrapper">
							<TripDropdown onChange={(v) => setTripId(v)} />
						</div>
					) : (
						waypoint.trip_id
					)}
				</Action>

				<Action className="waypoint-admin-input" text="Name" description="Display name for this waypoint.">
					<div className="input-wrapper">
						<input type="text" value={name} onChange={(e) => setName(e.currentTarget.value)} />
					</div>
				</Action>
				<Action className="waypoint-admin-input" text="Prominent?" description="Whether this waypoint is displayed when zoomed out.">
					<div className="input-wrapper">
						<Toggle color="green" checked={prominent} onChange={(v) => setProminent(v.currentTarget.checked)} />
					</div>
				</Action>
				<Action className="waypoint-admin-input" text="Timestamp" description="When this waypoint was sent.">
					{inModal ? (
						<DateTimePicker className="waypoint-edit-date-picker" defaultValue={moment()} onChange={(v) => v && setTimestamp(v)} />
					) : (
						timestamp.format('MMM D, YYYY h:mm a')
					)}
				</Action>
				<Action className="waypoint-admin-input" text="Latitude" description="Latitude for this waypoint.">
					{inModal || !waypoint.managed ? (
						<div className="input-wrapper">
							<input type="text" value={latitude} onChange={(e) => setLatitude(e.currentTarget.value)} />
						</div>
					) : (
						waypoint.latitude
					)}
				</Action>
				<Action className="waypoint-admin-input" text="Longitude" description="Longitude for this waypoint.">
					{inModal || !waypoint.managed ? (
						<div className="input-wrapper">
							<input type="text" value={longitude} onChange={(e) => setLongitude(e.currentTarget.value)} />
						</div>
					) : (
						waypoint.longitude
					)}
				</Action>
				<Action
					className={'column'}
					text="Icon"
					description={
						<span className="mr-05">
							<FontAwesomeIcon className="mr-05" icon={(icon as IconName) || faMapMarkerAlt} /> {icon || '(default icon)'}
						</span>
					}
				>
					<IconSelector />
				</Action>
				<Action className={'column'} text="Color" description={<span className="mr-05">{color || '(default color)'}</span>}>
					<ColorSelector />
				</Action>
				{inModal ? (
					<Action className="action-button">
						<Button color="green" iconProps={{ icon: faPlus }} text="Create" onClick={() => addWaypoint()} />
					</Action>
				) : undefined}
			</div>
		</LocalizationProvider>
	)
}
