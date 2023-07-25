import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons'
import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLoaderData, useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/button/button'
import Menu from '../../components/menu/menu'
import { Trip as TripResponse } from 'tracker-server-client'
import { MenuItem } from '../../components/menu-item/menu-item'
import { faInfoCircle, faMap } from '@fortawesome/pro-solid-svg-icons'

import './trip.css'

export const Trip = () => {
	const trip = useLoaderData() as TripResponse
	const navigate = useNavigate()
	const location = useLocation()

	return (
		<>
			<Menu
				headerProps={{
					className: 'single-button corner-left',
					title: trip?.name,
					leftActions: (
						<Button
							color="primary"
							onClick={() => navigate('/')}
							iconProps={{
								icon: faChevronLeft,
							}}
						/>
					),
				}}
			>
				<MenuItem destination={`/trip/${trip.id}`} icon={faInfoCircle} text="Details" color="blue" />
				<MenuItem destination={`map`} icon={faMap} text="Map" color="purple" />
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
	)
}
