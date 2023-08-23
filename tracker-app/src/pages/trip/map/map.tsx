/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconName, faMapMarkerAlt } from '@fortawesome/pro-solid-svg-icons'
import { useLoaderData, useRouteLoaderData } from 'react-router-dom'
import { Layer, Map, NavigationControl, Source, Popup, MapLayerMouseEvent, Marker } from 'react-map-gl'
import { Trip, Waypoint } from 'tracker-server-client'
import { TripGeoJSON } from '../../../loaders/geojson'
import useReload from '../../../hooks/reload'
import { AddToLibrary } from '../../../components/icons/icons'
import { Point, PointPopup } from '../../../components/point-popup/point-popup'

import 'mapbox-gl/dist/mapbox-gl.css'
import './map.css'
import moment from 'moment'

interface PopupInfo {
	latitude: number
	longitude: number
	feature: Point
	trip: Trip
}

export const TripMap = () => {
	const trip = useRouteLoaderData('trip') as Trip
	const tripJSON = useLoaderData() as TripGeoJSON
	useReload(tripJSON, 5 * 60)
	const [popupInfo, setPopupInfo] = useState<PopupInfo>()
	const isCurrentTrip = moment(trip.start_date) < moment() && moment(trip.end_date) > moment()
	const [zoom, setZoom] = useState(trip.type === 'scuba' && isCurrentTrip ? 12 : 8)

	const points = tripJSON?.points?.features
	const lastLocation = points && points[points.length - 1]

	const courseRegex = /(\d{1,3}\.\d{2}) ° True/
	const lastCourse = lastLocation?.properties?.Course as string
	const courseMatch = lastCourse?.match(courseRegex)
	const lastBearing = lastCourse && courseMatch ? courseMatch[1] : '0'

	const mapStyle = trip.type === 'scuba' ? 'clki08zbf003q01r24v4l5vuq' : 'clkhyotqc003m01pm7lz5d6c9'

	AddToLibrary()

	const onClick = useCallback((event: MapLayerMouseEvent) => {
		const { features } = event

		if (features && features.length > 0) {
			const points = features.filter((f) => f.geometry.type === 'Point')

			if (points.length > 0) {
				const point = points[0]

				if (point && point.properties) {
					const courseMatch = point.properties.Course.match(courseRegex)

					const velocityRegex = /(\d{1,3}\.\d{1}) km\/h/
					const velocityMatch = point.properties.Velocity.match(velocityRegex)

					const pseudoTrip: Trip = {
						...trip,
						status: {
							activity: trip.status.activity,
							position: {
								latitude: Number(point.properties.Latitude),
								longitude: Number(point.properties.Longitude),
								course: courseMatch && courseMatch[1],
								velocity: velocityMatch && velocityMatch[1],
								timestamp: point.properties.timestamp,
							},
						},
					}

					setPopupInfo({
						latitude: Number(point.properties.Latitude),
						longitude: Number(point.properties.Longitude),
						feature: point as unknown as Point,
						trip: pseudoTrip,
					})
				}
			}
		}
	}, [])

	const MarkerPin = ({ waypoint }: { waypoint: Waypoint }) => {
		return (
			<div className="marker-wrapper">
				<div className={`marker ${waypoint.color || ''}`}>
					<div className="marker-content">
						<FontAwesomeIcon icon={(waypoint.icon as IconName) || faMapMarkerAlt} />
						<span>{waypoint.name}</span>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="trip-map">
			{tripJSON && (
				<Map
					mapboxAccessToken={tripJSON.mapbox.token}
					initialViewState={{
						longitude: trip.center_point.longitude,
						latitude: trip.center_point.latitude,
						zoom: zoom,
						pitch: 60,
						bearing: trip.type === 'scuba' && isCurrentTrip ? parseFloat(lastBearing) : undefined,
					}}
					style={{ borderBottomRightRadius: '16px' }}
					mapStyle={`mapbox://styles/vladzaharia/${mapStyle}`}
					interactiveLayerIds={[`${trip.id}-points`]}
					onClick={onClick}
					onZoomEnd={(e) => { setZoom(e.viewState.zoom) }}
				>
					<NavigationControl visualizePitch={true} position="top-left" />
					<Source id="points" type="geojson" data={tripJSON.points}>
						<Layer
							id={`${trip.id}-points`}
							type="circle"
							minzoom={trip.type === 'scuba' ? 10 : 7}
							paint={{
								'circle-radius': 6,
								'circle-color': trip.type === 'scuba' ? '#77bcf8' : '#fff',
								'circle-stroke-color': trip.type === 'scuba' ? '#51a9f6' : '#5a4949',
								'circle-stroke-width': 5,
								'circle-opacity': 0.8,
								'circle-stroke-opacity': 0.35,
							}}
						/>
					</Source>
					<Source id="track" type="geojson" data={tripJSON.track}>
						<Layer
							id={`${trip.id}-track`}
							type="line"
							paint={{ 'line-width': trip.type === 'scuba' ? 5 : 3, 'line-color': trip.type === 'scuba' ? '#9ECFFA' : '#dad2d2' }}
							layout={{ 'line-cap': 'round', 'line-join': 'round' }}
						/>
					</Source>
					{trip.waypoints.length > 0 ? ((zoom > (trip.type === 'scuba' ? 10 : 7)) ? trip.waypoints : trip.waypoints.filter((wp) => wp.prominent)).map((wp) => (
								<Marker key={wp.timestamp} longitude={wp.longitude} latitude={wp.latitude}>
									<MarkerPin waypoint={wp} />
								</Marker>
						  ))
						: undefined}
					{popupInfo && (
						<Popup
							anchor="top"
							longitude={Number(popupInfo.longitude)}
							latitude={Number(popupInfo.latitude)}
							onClose={() => setPopupInfo(undefined)}
							closeOnClick={false}
							closeOnMove={true}
							offset={15}
						>
							<div className="map-popup-content">
								<PointPopup point={popupInfo.feature} />
							</div>
						</Popup>
					)}
				</Map>
			)}
		</div>
	)
}
