import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLoaderData, useLocation } from 'react-router-dom'
import { Trip as TripResponse } from 'tracker-server-client'
import { faCrystalBall, faHourglass, faLocationDot, faMessageLines, faPaperPlaneTop, faXmark } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SectionTitle from '../../components/section-title/section-title'
import { TripStatus } from '../../components/trip-status/trip-status'
import Menu from '../../components/menu/menu'
import useReload from '../../hooks/reload'
import { TripHeader } from '../../components/trip-header/trip-header'
import { TripPosition } from '../../components/trip-position/trip-position'
import moment from 'moment'
import Button from '../../components/button/button'
import Modal from '../../components/modal/modal'
import Header from '../../components/header/header'
import Action from '../../components/action/action'
import './trip.css'
import { useState } from 'react'
import { useNotificationAwareRequest } from '../../hooks/notification'
import { createActionApi } from '../../api'

export const Trip = () => {
	const trip = useLoaderData() as TripResponse
	const location = useLocation()
	const request = useNotificationAwareRequest()
	const api = createActionApi()
	useReload(trip, 5 * 60)

	const currentDate = moment(new Date())
	const isCurrenTrip = moment(trip.start_date) < currentDate && currentDate < moment(trip.end_date)

	// Send message modal
	const [messagePhoneNumber, setMessagePhoneNumber] = useState<string>('')
	const [messageText, setMessageText] = useState<string>('')
	const [showMessageModal, setShowMessageModal] = useState<boolean>(false)
	const onSendMessage = async () => {
		if (messagePhoneNumber && messagePhoneNumber.length > 0 && messageText && messageText.length > 0) {
			await request(
				async () => {
					await api.sendMessage({
						phoneNumber: messagePhoneNumber,
						message: messageText,
					})
				},
				{
					message: `Message sent!`,
				},
				() => setShowMessageModal(false)
			)
		}
	}

	return (
		<>
			<TripHeader />
			<div className="trip-wrapper">
				{trip.status ? (
					<>
						<Menu className="trip-details">
							<SectionTitle>
								<FontAwesomeIcon className="mr-05" icon={faLocationDot} /> Last Position
							</SectionTitle>
							<TripPosition />
							<TripStatus />
						</Menu>

						<AnimatePresence mode="popLayout">
							<motion.div
								className="trip-content no-animate"
								key={location.pathname}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.5 }}
							>
								<Outlet />
							</motion.div>
						</AnimatePresence>
					</>
				) : moment(trip.start_date) > moment() ? (
					<div className="trip-no-data-wrapper">
						<div className={`trip-no-data blue`}>
							<FontAwesomeIcon icon={faCrystalBall} size="4x" />
							<span className="fs-xlarge mt-1">This trip is in the future!</span>
							<span>I don't have a crystal ball, you'll have to wait until it starts.</span>
						</div>
					</div>
				): (
					<div className="trip-no-data-wrapper">
						<div className={`trip-no-data orange`}>
							<FontAwesomeIcon icon={faHourglass} size="4x" />
							<span className="fs-xlarge mt-1">This trip doesn't have any data!</span>
							<span>Check back later to see my progress.</span>
						</div>
					</div>
				)}
				{isCurrenTrip ? (
					<div className="floating-buttons">
						<Button className="send-message" color="green" iconProps={{ icon: faMessageLines }} onClick={() => setShowMessageModal(true)} />

						<Modal open={showMessageModal} className={`send-message-modal`} onClose={() => setShowMessageModal(false)}>
							<>
								<Header
									className="corner-left-05 corner-right-05"
									title={
										<>
											<FontAwesomeIcon className="mr-05" icon={faMessageLines} /> Send message
										</>
									}
									rightActions={
										<div className="modal-header-buttons">
											<Button color="red" iconProps={{ icon: faXmark }} onClick={() => setShowMessageModal(false)} />
										</div>
									}
								/>
								<div className="warning-text">Message will be sent next time the device connects to satellites.</div>
								<Action text="Phone number" description="Replies will be sent to this number">
									<div className="input-wrapper">
										<input
											className="green"
											type="text"
											value={messagePhoneNumber}
											onChange={(e) => setMessagePhoneNumber(e.currentTarget.value)}
										/>
									</div>
								</Action>
								<Action className="column" text="Message" description={`${messageText.length}/160`}>
									<textarea className="green" value={messageText} maxLength={160} onChange={(e) => setMessageText(e.currentTarget.value)} />
								</Action>
								<Action className="action-button">
									<Button color="green" iconProps={{ icon: faPaperPlaneTop }} text="Send" onClick={onSendMessage} />
								</Action>
							</>
						</Modal>
					</div>
				) : undefined}
			</div>
		</>
	)
}
