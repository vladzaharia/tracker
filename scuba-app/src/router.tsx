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
import { GetTrip } from './pages/get/get'

const router = createBrowserRouter([
	{
		element: (
			<App>
				<ContentBox />
			</App>
		),
		id: 'root',
		errorElement: (
			<ContentBox>
				<RouterErrorBoundary />
			</ContentBox>
		),
		loader: ListTripLoader,
		children: [
			{
				path: '/',
				id: 'trips',
				element: <ListTrips />,
			},
			{
				path: 'trip/',
				id: 'trips-alt',
				element: <ListTrips />,
			},
			{
				path: 'trip/:trip',
				id: 'trip',
				loader: GetTripLoader,
				element: <GetTrip />,
			},
		],
	},
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
)
