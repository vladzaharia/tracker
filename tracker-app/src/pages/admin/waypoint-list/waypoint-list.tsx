import { useLoaderData, useNavigate } from 'react-router-dom'
import './waypoint-list.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { faXmark, faMapMarkerAlt, IconName } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Table from '../../../components/table/table'
import useReload from '../../../hooks/reload'
import { ListWaypoints200Response } from 'tracker-server-client'
import moment from 'moment'
import { AddToLibrary } from '../../../components/icons/icons'

export default function WaypointListAdmin() {
	const { waypoints } = useLoaderData() as ListWaypoints200Response
	useReload(waypoints)
	const navigate = useNavigate()

	AddToLibrary()

	return (
		<div className="list admin-waypoint-list">
			<Header
				title="Waypoints"
				color="green"
				className="corner-right"
				leftActions={<FontAwesomeIcon icon={faMapMarkerAlt} size="lg" />}
				rightActions={<Button color="green" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
			/>
			<Table
				color="green"
				headers={[
					{ element: 'Waypoint name' },
					{ element: 'Trip ID', className: 'no-mobile' },
					{ element: 'Timestamp', className: 'no-mobile table-cell-md' },
				]}
				rows={waypoints.map((waypoint) => {
					return {
						name: `${waypoint.trip_id}-${waypoint.timestamp}`,
						cells: [
							{
								element: (
									<>
										<FontAwesomeIcon icon={(waypoint.icon as IconName) || faMapMarkerAlt} className="mr-05" /> {waypoint.name}
									</>
								),
							},
							{ element: waypoint.trip_id, className: 'no-mobile' },
							{ element: moment(new Date(waypoint.timestamp)).format('MMM D, YYYY h:mm a'), className: 'no-mobile table-cell-md' },
						],
						onClick: () => navigate(`${waypoint.trip_id}/${waypoint.timestamp}`),
					}
				})}
			/>
		</div>
	)
}
