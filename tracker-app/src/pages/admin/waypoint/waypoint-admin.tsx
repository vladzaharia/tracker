import './waypoint-admin.css'
import { Waypoint } from 'tracker-server-client'
import { useAuth } from 'react-oidc-context'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useNotificationAwareRequest } from '../../../hooks/notification'
import useReload from '../../../hooks/reload'
import { useState } from 'react'
import { createAdminApi } from '../../../api'
import Header from '../../../components/header/header'
import { IconName, faCheck, faChevronLeft, faMapMarkerAlt } from '@fortawesome/pro-solid-svg-icons'
import Button from '../../../components/button/button'
import Action from '../../../components/action/action'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AVAILABLE_ICONS, AddToLibrary } from '../../../components/icons/icons'
import Pill from '../../../components/pill/pill'
import moment from 'moment'

export default function TripAdmin() {
	const waypoint = useLoaderData() as Waypoint
	useReload(waypoint)
	const navigate = useNavigate()
	const request = useNotificationAwareRequest()
	const auth = useAuth()
	const api = createAdminApi(auth.user?.access_token || '')

	const [name, setName] = useState(waypoint.name || '')
	const [icon, setIcon] = useState<string | null>(waypoint.icon || '')

	const updateWaypoint = async () => {
		await request(() =>
			api.updateWaypoint(waypoint.trip_id, waypoint.timestamp, {
				name,
				icon: icon || undefined,
			})
		)
		navigate('/admin/waypoint')
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

	return (
		<div className="waypoint-admin">
			<Header
				title={waypoint.name}
				color="green"
				className="corner-right"
				leftActions={<Button color="green" onClick={() => navigate(`/admin/waypoint`)} iconProps={{ icon: faChevronLeft }} />}
				rightActions={<Button color="green" onClick={() => updateWaypoint()} iconProps={{ icon: faCheck }} />}
			/>
			<Action className="waypoint-admin-input" text="Trip" description="Trip associated to this waypoint.">
				{waypoint.trip_id}
			</Action>
			<Action className="waypoint-admin-input" text="Name" description="Display name for this waypoint.">
				<div className="input-wrapper">
					<input type="text" value={name} onChange={(e) => setName(e.currentTarget.value)} />
				</div>
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
			<Action className="waypoint-admin-input" text="Latitude" description="Latitude for this waypoint.">
				{waypoint.latitude}
			</Action>
			<Action className="waypoint-admin-input" text="Longitude" description="Longitude for this waypoint.">
				{waypoint.longitude}
			</Action>
			<Action className="waypoint-admin-input" text="Timestamp" description="When this waypoint was sent.">
				{moment(waypoint.timestamp).format('MMM D, YYYY h:mm a')}
			</Action>
		</div>
	)
}
