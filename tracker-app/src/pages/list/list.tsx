import { useLoaderData, useNavigate } from 'react-router-dom'
import './list.css'
import { BasicTrip, ListTrips200Response, Trip } from 'tracker-server-client'
import SectionTitle from '../../components/section-title/section-title'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGauge, faGlobeAmericas, faHourglass, faLocationArrow } from '@fortawesome/pro-solid-svg-icons'
import { DateDuration, TripHeader } from '../../components/trip-header/trip-header'
import moment from 'moment'
import Action from '../../components/action/action'

const TripsEntry = ({ title, trips }: { title: string; trips: BasicTrip[] }) => {
	const navigate = useNavigate()

	return (
		<div>
			<SectionTitle>{title}</SectionTitle>
			{trips.map((t) => (
				<TripHeader className="lg" trip={t} key={t.id} onClick={() => navigate(`/${t.id}`)} />
			))}
		</div>
	)
}

const CurrentTrip = ({ trip }: { trip: Trip }) => {
	const navigate = useNavigate()

	const getDirection = (course: number) => {
		if (course < 22.5 && course >= 337.5) {
			return 'N'
		} else if (course < 67.5 && course >= 22.5) {
			return 'NW'
		} else if (course < 112.5 && course >= 67.5) {
			return 'W'
		} else if (course < 157.5 && course >= 112.5) {
			return 'SW'
		} else if (course < 202.5 && course >= 157.5) {
			return 'S'
		} else if (course < 247.5 && course >= 202.5) {
			return 'SE'
		} else if (course < 292.5 && course >= 247.5) {
			return 'E'
		} else if (course < 337.5 && course >= 292.5) {
			return 'NE'
		}
	}

	return (
		<div className={`trip-header current clickable ${trip.status ? 'has-status' : ''}`} onClick={() => navigate(`/${trip.id}`)}>
			<div className="trip">
				<h1>
					<span className="mr-05">{trip.emoji}</span> {trip.name}
				</h1>
				<DateDuration otherYear={false} className={'current'} startDate={moment(trip.start_date)} endDate={moment(trip.end_date)} />
			</div>
			{trip.status ? (
				<div className="position">
					<Action text="Last position">
						{trip.status.position.latitude}, {trip.status.position.longitude}
					</Action>
					<Action
						text={
							<>
								<FontAwesomeIcon className="mr-05" icon={faGauge} /> Speed
							</>
						}
					>
						<span>{trip.status.position.velocity} km/h</span>
					</Action>
					<Action
						text={
							<>
								<FontAwesomeIcon className="mr-05" icon={faLocationArrow} /> Course
							</>
						}
					>
						<span>
							{trip.status.position.course} ° {getDirection(trip.status.position.course)}
						</span>
					</Action>
					<Action
						text={
							<>
								<FontAwesomeIcon className="mr-05" icon={faHourglass} /> Last updated
							</>
						}
					>
						<span>{moment(trip.status.position.timestamp).fromNow()}</span>
					</Action>
				</div>
			) : undefined}
		</div>
	)
}

export const ListTrips = () => {
	const trips = useLoaderData() as ListTrips200Response

	return (
		<>
			<div className="trip-list-title-wrapper">
				<h1>
					<FontAwesomeIcon className="mr-1" size="lg" icon={faGlobeAmericas} /> Trip Tracker
				</h1>
			</div>
			<div className="trip-list-wrapper">
				<div className="trip-list">
					{trips.current ? <CurrentTrip trip={trips.current} /> : undefined}
					<TripsEntry title="Upcoming trips" trips={trips.upcoming} />
					<TripsEntry title="Past trips" trips={trips.past} />
				</div>
			</div>
		</>
	)
}
