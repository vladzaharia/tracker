import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLoaderData, useLocation } from 'react-router-dom'
import { Trip as TripResponse } from 'tracker-server-client'

import './trip.css'
import { DateDuration } from '../../components/date-duration/date-duration'
import moment from 'moment-timezone'
import { faGauge, faHourglass, faLocationArrow, faLocationDot } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SectionTitle from '../../components/section-title/section-title'
import Action from '../../components/action/action'
import { TripStatus } from '../../components/trip-status/trip-status'
import Menu from '../../components/menu/menu'

export const Trip = () => {
	const trip = useLoaderData() as TripResponse
	const location = useLocation()

	return (
		<>
			<div className="trip-header">
				<h1>
					<span className="mr-05">{trip.emoji}</span> {trip.name}
				</h1>
				<DateDuration startDate={moment(trip.start_date)} endDate={moment(trip.end_date)} />
			</div>
			<div className="trip-wrapper">
				{trip.status ? (
					<>
						<Menu className="trip-details">
							<SectionTitle>
								<FontAwesomeIcon className="mr-05" icon={faLocationDot} /> Last Position
							</SectionTitle>
							<div className="last-position">
								<Action text="Latitude">{trip.status.position.latitude}</Action>
								<Action text="Longitude">{trip.status.position.longitude}</Action>

								<Action
									text={
										<>
											<FontAwesomeIcon className="mr-05" icon={faGauge} /> Speed
										</>
									}
								>
									<span>
										<span className="fw-500">{trip.status.position.velocity}</span> km/h
									</span>
								</Action>
								<Action
									text={
										<>
											<FontAwesomeIcon className="mr-05" icon={faLocationArrow} /> Course
										</>
									}
								>
									<span>
										<span className="fw-500">{trip.status.position.course}</span> °
									</span>
								</Action>
								<span>
									Updated <span className="fw-500">{moment(trip.status.position.timestamp).fromNow()}</span>
								</span>
							</div>
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
				) : (
					<div className="trip-no-data-wrapper">
						<div className="trip-no-data">
							<FontAwesomeIcon icon={faHourglass} size="4x" />
							<span className="fs-xlarge">This trip doesn't have any data!</span>
							<span>Check back later to see my progress.</span>
						</div>
					</div>
				)}
			</div>
		</>
	)
}
