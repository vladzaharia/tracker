import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './components/app/app'
import ContentBox from './components/content-box/content-box'
import './styles'
import { RouterErrorBoundary } from './pages/error/error'
import ListTripLoader from './loaders/list'
import GetTripLoader from './loaders/get'
import { ListTrips } from './pages/list/list'
import { Trip } from './pages/trip/trip'
import GetTripGeoJSONLoader from './loaders/geojson'
import { TripMap } from './pages/trip/map/map'
import { AuthProvider, AuthProviderProps } from 'react-oidc-context'

const oidcConfig: AuthProviderProps = {
	authority: 'https://auth.zhr.one/application/o/trip-tracker/',
	client_id: '9FbtspzZkyBQfCUCCtZbj38eKrMRFn26cwpu2D3C',
	redirect_uri: `${window.location.protocol}//${window.location.host}${window.location.pathname}`,
	scope: 'openid profile',
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
		loader: ListTripLoader,
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
