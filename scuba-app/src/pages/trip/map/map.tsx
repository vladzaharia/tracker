/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLoaderData, useRouteLoaderData } from "react-router-dom"
import { Layer, Map, Source } from "react-map-gl"
import { Trip as TripResponse } from "scuba-server-client"

import 'mapbox-gl/dist/mapbox-gl.css';
import './map.css'


export const TripMap = () => {
	const trip = useRouteLoaderData('trip') as TripResponse
	const tripJSON = useLoaderData() as any
	const points = tripJSON?.features?.filter((f: any) => f?.geometry?.type === "Point")
	const lastLocation = points[points.length - 1]

	const regex = /(\d{1,3}\.\d{2}) ° True/
	const lastCourse = lastLocation?.properties?.Course as string
	const courseMatch = lastCourse.match(regex)
	const lastBearing = lastCourse && courseMatch ? courseMatch[1] : "0"

	const mapStyle = trip.type === 'scuba' ? 'clkhx79i6003h01pm6n3fbgu9' : "clkhynpg5003l01q2706gc80k"

	return <div className="trip-map">
		<Map
			mapboxAccessToken="pk.eyJ1IjoidmxhZHphaGFyaWEiLCJhIjoiY2xraHpnNDMyMGRkcjNxcDQ1bXVyZHVrbiJ9.JTKDWIqIwMjJs9K4D0Qjdw"
      initialViewState={{
        longitude: lastLocation?.geometry?.coordinates[0],
        latitude: lastLocation?.geometry?.coordinates[1],
        zoom: 8,
				pitch: trip.type === 'scuba' ? 60 : undefined,
				bearing: trip.type === 'scuba' ? parseFloat(lastBearing) : undefined
      }}

			// style={{width: 750, height: 450}}
			style={{ borderTopRightRadius: "1rem", borderBottomRightRadius: "1rem" }}
      mapStyle={`mapbox://styles/vladzaharia/${mapStyle}`}>
      <Source id="my-data" type="geojson" data={tripJSON}>
        <Layer type="line" />
      </Source>
    </Map>
	</div>
}
