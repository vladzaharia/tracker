import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLoaderData, useLocation } from 'react-router-dom'
import { Trip as TripResponse } from 'tracker-server-client'
import { faHourglass, faLocationDot } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SectionTitle from '../../components/section-title/section-title'
import { TripStatus } from '../../components/trip-status/trip-status'
import Menu from '../../components/menu/menu'
import useReload from '../../hooks/reload'
import { TripHeader } from '../../components/trip-header/trip-header'
import { TripPosition } from '../../components/trip-position/trip-position'

import './trip.css'

export const Trip = () => {
	const trip = useLoaderData() as TripResponse
	const location = useLocation()
	useReload(trip, 5 * 60)

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
