import { useLoaderData, useNavigate } from 'react-router-dom'
import './waypoint-list.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { faXmark, faMapMarkerAlt, IconName, faTrash, faPlus } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Table from '../../../components/table/table'
import useReload from '../../../hooks/reload'
import { ListWaypoints200Response } from 'tracker-server-client'
import moment from 'moment'
import { AddToLibrary } from '../../../components/icons/icons'
import Modal, { ConfirmModal } from '../../../components/modal/modal'
import { useState } from 'react'
import { useAuth } from 'react-oidc-context'
import { createAdminApi } from '../../../api'
import { useNotificationAwareRequest } from '../../../hooks/notification'
import { WaypointEdit } from '../../../components/waypoint-edit/waypoint-edit'

export default function WaypointListAdmin() {
	const { waypoints } = useLoaderData() as ListWaypoints200Response
	useReload(waypoints)
	const navigate = useNavigate()
	const auth = useAuth()
	const api = createAdminApi(auth.user?.access_token || '')
	const request = useNotificationAwareRequest()
	const [deleteModalInfo, setDeleteModalInfo] = useState<{ trip_id: string, timestamp: number } | undefined>()
	const [showCreateModal, setShowCreateModal] = useState<boolean>(false)

	const deleteWaypoint = async (trip_id: string, timestamp: number) => {
		await request(
			async () => await api.deleteWaypoint(trip_id, timestamp),
			{
				message: `Waypoint ${trip_id}/${timestamp} deleted successfully!`,
				source: 'waypoint',
				icon: faTrash,
			},
			() => setDeleteModalInfo(undefined),
			() => setDeleteModalInfo(undefined)
		)
	}
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
					{
						element: (
							<div className="buttons">
								<Button color="green" iconProps={{ icon: faPlus }} onClick={() => setShowCreateModal(true)} />
							</div>
						),
					},
				]}
				rows={waypoints.map((waypoint) => {
					return {
						name: `${waypoint.trip_id}-${waypoint.timestamp}`,
						color: waypoint.color,
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
							{
								element: !waypoint.managed ? (
									<div className="buttons">
										<Button
											color="red"
											iconProps={{ icon: faTrash }}
											onClick={(e) => {
												e.stopPropagation()
												setDeleteModalInfo(waypoint)
											}}
										/>
									</div>
								) : '',
							},
						],
						onClick: () => navigate(`${waypoint.trip_id}/${waypoint.timestamp}`),
					}
				})}
			/>
			<ConfirmModal
				title={`Delete ${deleteModalInfo?.trip_id}/${deleteModalInfo?.timestamp}?`}
				icon={faTrash}
				open={!!deleteModalInfo}
				text={`Are you sure you want to delete this waypoint?`}
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				onConfirm={() => deleteWaypoint(deleteModalInfo!.trip_id, deleteModalInfo!.timestamp)}
				onClose={() => setDeleteModalInfo(undefined)}
			/>

			<Modal className="create-modal" open={showCreateModal} onClose={() => setShowCreateModal(false)}>
				<>
					<Header
						className="corner-left-05 corner-right-05"
						title={
							<>
								<FontAwesomeIcon className="mr-05" icon={faMapMarkerAlt} /> Add waypoint
							</>
						}
						rightActions={
							<div className="modal-header-buttons">
								<Button color="primary" iconProps={{ icon: faXmark }} onClick={() => setShowCreateModal(false)} />
							</div>
						}
					/>
					<WaypointEdit inModal onModalClose={() => setShowCreateModal(false)} />
				</>
			</Modal>
		</div>
	)
}
