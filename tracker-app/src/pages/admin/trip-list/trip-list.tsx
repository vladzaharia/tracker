import { useLoaderData, useNavigate } from 'react-router-dom'
import './trip-list.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { faPlus, faTrash, faXmark, faGlobeAmericas, faMaskSnorkel, faVanShuttle, faSquareQuestion } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Table from '../../../components/table/table'
import { useState } from 'react'
import { createAdminApi } from '../../../api'
import { useAuth } from 'react-oidc-context'
import { useNotificationAwareRequest } from '../../../hooks/notification'
import Modal, { ConfirmModal } from '../../../components/modal/modal'
import useReload from '../../../hooks/reload'
import { BasicTrip, ListTrips200Response, TripType } from 'tracker-server-client'
import moment from 'moment'
import { TripEdit } from '../../../components/trip-edit/trip-edit'

export default function TripListAdmin() {
	const trips = useLoaderData() as ListTrips200Response
	useReload(trips)
	const navigate = useNavigate()
	const auth = useAuth()
	const api = createAdminApi(auth.user?.access_token || '')
	const request = useNotificationAwareRequest()
	const [deleteModalTripId, setDeleteModalTripId] = useState<string | undefined>()
	const [showCreateModal, setShowCreateModal] = useState<boolean>(false)

	// const api = createAdminApi(auth.user?.access_token || '')
	const deleteTrip = async (id: string) => {
		await request(
			async () => await api.deleteTrip(id),
			{
				message: `Trip ${id} deleted successfully!`,
				source: 'trip',
				icon: faTrash,
			},
			() => setDeleteModalTripId(undefined),
			() => setDeleteModalTripId(undefined)
		)
	}

	const getTripTypeIcon = (type: TripType) => {
		switch (type) {
			case 'scuba':
				return faMaskSnorkel
			case 'road':
				return faVanShuttle
			case 'other':
				return faSquareQuestion
		}
	}

	const getTripTypeText = (type: TripType) => {
		switch (type) {
			case 'scuba':
				return 'Scuba'
			case 'road':
				return 'Road'
			case 'other':
				return 'Other'
		}
	}

	let allTrips: BasicTrip[] = trips.current ? [trips.current] : []
	allTrips = [...trips.upcoming, ...allTrips, ...trips.past]

	return (
		<div className="list admin-trip-list">
			<Header
				title="Trips"
				color="blue"
				className="corner-right"
				leftActions={<FontAwesomeIcon icon={faGlobeAmericas} size="lg" />}
				rightActions={<Button color="blue" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
			/>
			<Table
				color="blue"
				headers={[
					{ element: 'Trip name' },
					{ element: 'Type', className: 'show-mobile' },
					{ element: 'Start date', className: 'no-mobile' },
					{ element: 'End date', className: 'no-mobile' },
					{
						element: (
							<div className="buttons">
								<Button color="green" iconProps={{ icon: faPlus }} onClick={() => setShowCreateModal(true)} />
							</div>
						),
					},
				]}
				rows={allTrips.map((trip) => {
					return {
						name: trip.id,
						cells: [
							{
								element: (
									<>
										<span className="mr-05">{trip.emoji}</span> {trip.name}
									</>
								),
							},
							{
								element: (
									<span>
										<FontAwesomeIcon className="mr-05" icon={getTripTypeIcon(trip.type)} /> {getTripTypeText(trip.type)}
									</span>
								),
								className: 'show-mobile',
							},
							{ element: moment(trip.start_date).format('MMM D, YYYY') },
							{ element: moment(trip.end_date).format('MMM D, YYYY') },
							{
								element: (
									<div className="buttons">
										<Button
											color="primary"
											iconProps={{ icon: faTrash }}
											onClick={(e) => {
												e.stopPropagation()
												setDeleteModalTripId(trip.id)
											}}
										/>
									</div>
								),
							},
						],
						onClick: () => navigate(trip.id),
					}
				})}
			/>

			<ConfirmModal
				title={`Delete ${deleteModalTripId}?`}
				icon={faTrash}
				open={!!deleteModalTripId}
				text={`Are you sure you want to delete ${deleteModalTripId}?`}
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				onConfirm={() => deleteTrip(deleteModalTripId!)}
				onClose={() => setDeleteModalTripId(undefined)}
			/>

			<Modal className="create-modal" open={showCreateModal} onClose={() => setShowCreateModal(false)}>
				<>
					<Header
						className="corner-left-05 corner-right-05"
						title={
							<>
								<FontAwesomeIcon className="mr-05" icon={faGlobeAmericas} /> Add trip
							</>
						}
						rightActions={
							<div className="modal-header-buttons">
								<Button color="primary" iconProps={{ icon: faXmark }} onClick={() => setShowCreateModal(false)} />
							</div>
						}
					/>
					<TripEdit inModal onModalClose={() => setShowCreateModal(false)} />
				</>
			</Modal>
		</div>
	)
}
