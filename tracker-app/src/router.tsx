import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './components/app/app'
import ContentBox from './components/content-box/content-box'
import './styles'
import { RouterErrorBoundary } from './pages/error/error'
import ListTripLoader from './loaders/trip-list'
import GetTripLoader from './loaders/trip-get'
import { ListTrips } from './pages/list/list'
import { Trip } from './pages/trip/trip'
import GetTripGeoJSONLoader from './loaders/geojson'
import { TripMap } from './pages/trip/map/map'
import { AuthProvider, AuthProviderProps } from 'react-oidc-context'
import Admin from './pages/admin/admin'
import AdminDatabase from './pages/admin/database/database'
import AdminHome from './pages/admin/home/home'
import DatabaseLoader from './loaders/database'
import TripListAdmin from './pages/admin/trip-list/trip-list'
import TripAdmin from './pages/admin/trip/trip-admin'
import ListWaypointLoader from './loaders/waypoint-list'
import GetWaypointLoader from './loaders/waypoint-get'
import WaypointListAdmin from './pages/admin/waypoint-list/waypoint-list'
import WaypointAdmin from './pages/admin/waypoint/waypoint-admin'

const oidcConfig: AuthProviderProps = {
	authority: 'https://auth.zhr.one/application/o/trip-tracker/',
	client_id: '9FbtspzZkyBQfCUCCtZbj38eKrMRFn26cwpu2D3C',
	redirect_uri: `${window.location.protocol}//${window.location.host}${window.location.pathname}`,
	scope: 'openid profile tracker',
	onSigninCallback: () => {
		window.history.replaceState({}, document.title, window.location.pathname)
	},
}

const router = createBrowserRouter([
	{
		element: (
			<App>
				<ContentBox />
			</App>
		),
		id: 'root',
		errorElement: (
			<App>
				<ContentBox>
					<RouterErrorBoundary />
				</ContentBox>
			</App>
		),
		children: [
			{
				path: '/',
				id: 'trips',
				loader: ListTripLoader,
				element: <ListTrips />,
			},
			{
				path: ':trip',
				id: 'trip',
				element: <Trip />,
				loader: GetTripLoader,
				children: [
					{
						path: '',
						id: 'trip-map',
						loader: GetTripGeoJSONLoader,
						element: <TripMap />,
					},
				],
			},
			{
				path: 'admin',
				element: <Admin />,
				children: [
					{
						path: '',
						id: 'admin-home',
						element: <AdminHome />,
					},
					{
						path: 'trip',
						id: 'admin-trip-list',
						loader: ListTripLoader,
						element: <TripListAdmin />,
					},
					{
						path: 'trip/:trip',
						id: 'admin-trip',
						loader: GetTripLoader,
						element: <TripAdmin />,
					},
					{
						path: 'waypoint',
						id: 'admin-waypoint-list',
						loader: ListWaypointLoader,
						element: <WaypointListAdmin />,
					},
					{
						path: 'waypoint/:trip/:timestamp',
						id: 'admin-waypoint',
						loader: GetWaypointLoader,
						element: <WaypointAdmin />,
					},
					{
						path: 'database',
						id: 'admin-database',
						loader: DatabaseLoader,
						element: <AdminDatabase />,
					},
				],
			},
		],
	},
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<StrictMode>
		<AuthProvider {...oidcConfig}>
			<RouterProvider router={router} />
		</AuthProvider>
	</StrictMode>
)
