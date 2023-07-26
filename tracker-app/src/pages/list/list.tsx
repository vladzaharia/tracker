import { useLoaderData, useNavigate } from 'react-router-dom'
import './list.css'
import { BasicTrip, ListTrips200Response, Trip } from 'tracker-server-client'
import SectionTitle from '../../components/section-title/section-title'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobeAmericas } from '@fortawesome/pro-solid-svg-icons'
import { DateDuration, TripHeader } from '../../components/trip-header/trip-header'
import moment from 'moment'
import { Map, Marker } from 'react-map-gl'
import { TripPosition } from '../../components/trip-position/trip-position'

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

	const mapStyle = trip.type === 'scuba' ? 'clki08zbf003q01r24v4l5vuq' : 'clkhyotqc003m01pm7lz5d6c9'

	return (
		<div className="trip-header current clickable" onClick={() => navigate(`/${trip.id}`)}>
			<div className="left">
				<h1>
					<span className="mr-05">{trip.emoji}</span> {trip.name}
				</h1>
				{trip.status ? (
					<div className="trip-position-details">
						<h2>Last position</h2>
						<TripPosition trip={trip} />
					</div>
				) : undefined}
			</div>
			<div className="right">
				<DateDuration outdated={false} className={'current'} startDate={moment(trip.start_date)} endDate={moment(trip.end_date)} />
				{trip.status ? (
					<div className="map">
						<Map
							mapboxAccessToken="pk.eyJ1IjoidmxhZHphaGFyaWEiLCJhIjoiY2xraHpnNDMyMGRkcjNxcDQ1bXVyZHVrbiJ9.JTKDWIqIwMjJs9K4D0Qjdw"
							initialViewState={{
								latitude: trip.status.position.latitude,
								longitude: trip.status.position.longitude,
								zoom: 15,
								pitch: 0,
								bearing: 0,
							}}
							mapStyle={`mapbox://styles/vladzaharia/${mapStyle}`}
							boxZoom={false}
							doubleClickZoom={false}
							dragRotate={false}
							dragPan={false}
							keyboard={false}
							scrollZoom={false}
							touchPitch={false}
							touchZoomRotate={false}
						>
							<Marker latitude={trip.status.position.latitude} longitude={trip.status.position.longitude} />
						</Map>
					</div>
				) : undefined}
			</div>
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
