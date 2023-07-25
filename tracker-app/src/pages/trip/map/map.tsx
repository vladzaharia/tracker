/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLoaderData, useRouteLoaderData } from 'react-router-dom'
import { Layer, Map, NavigationControl, Source, Popup, MapLayerMouseEvent, MapGeoJSONFeature } from 'react-map-gl'
import { Trip as TripResponse } from 'tracker-server-client'
import { TripGeoJSON } from '../../../loaders/geojson'
import moment from 'moment'

import 'mapbox-gl/dist/mapbox-gl.css'
import './map.css'
import { useCallback, useState } from 'react'

interface PopupInfo {
	latitude: number
	longitude: number
	feature: MapGeoJSONFeature
}

export const TripMap = () => {
	const trip = useRouteLoaderData('trip') as TripResponse
	const tripJSON = useLoaderData() as TripGeoJSON
	const [popupInfo, setPopupInfo] = useState<PopupInfo>()

	const points = tripJSON?.points.features
	const lastLocation = points[points.length - 1]

	const regex = /(\d{1,3}\.\d{2}) ° True/
	const lastCourse = lastLocation?.properties?.Course as string
	const courseMatch = lastCourse.match(regex)
	const lastBearing = lastCourse && courseMatch ? courseMatch[1] : '0'

	const mapStyle = trip.type === 'scuba' ? 'clki08zbf003q01r24v4l5vuq' : 'clkhyotqc003m01pm7lz5d6c9'

	const onClick = useCallback((event: MapLayerMouseEvent) => {
		const { features } = event

		if (features && features.length > 0) {
			const points = features.filter((f) => f.geometry.type === 'Point')

			if (points.length > 0) {
				const point = points[0]

				if (point && point.properties) {
					setPopupInfo({
						latitude: Number(point.properties.Latitude),
						longitude: Number(point.properties.Longitude),
						feature: point,
					})
				}
			}
		}
	}, [])

	return (
		<div className="trip-map">
			{tripJSON && (
				<Map
					mapboxAccessToken="pk.eyJ1IjoidmxhZHphaGFyaWEiLCJhIjoiY2xraHpnNDMyMGRkcjNxcDQ1bXVyZHVrbiJ9.JTKDWIqIwMjJs9K4D0Qjdw"
					initialViewState={{
						longitude: lastLocation?.geometry?.coordinates[0],
						latitude: lastLocation?.geometry?.coordinates[1],
						zoom: 8,
						pitch: 60,
						bearing: trip.type === 'scuba' ? parseFloat(lastBearing) : undefined,
					}}
					// style={{width: 750, height: 450}}
					style={{ borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem' }}
					mapStyle={`mapbox://styles/vladzaharia/${mapStyle}`}
					interactiveLayerIds={[`${trip.id}-points`]}
					onClick={onClick}
				>
					<NavigationControl visualizePitch={true} position="top-left" />
					<Source id="points" type="geojson" data={tripJSON.points}>
						<Layer
							id={`${trip.id}-points`}
							type="circle"
							minzoom={trip.type === 'scuba' ? 10 : 7}
							paint={{
								'circle-color': trip.type === 'scuba' ? '#77bcf8' : '#fff',
								'circle-stroke-color': trip.type === 'scuba' ? '#51a9f6' : '#5a4949',
								'circle-stroke-width': 4,
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
							<div>
								{`${moment.utc(popupInfo.feature.properties?.timestamp).format('MMM Do YYYY, HH:mm')} UTC`}
								{`${popupInfo.feature.properties?.Velocity}`}
								{`${popupInfo.feature.properties?.Course}`}
								{`${popupInfo.feature.properties?.Elevation}`}
								{`${popupInfo.feature.properties?.Latitude}`}
								{`${popupInfo.feature.properties?.Longitude}`}
								{`${popupInfo.feature.properties?.Text}`}
							</div>
						</Popup>
					)}
				</Map>
			)}
		</div>
	)
}
