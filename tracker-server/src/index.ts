import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { cors } from 'hono/cors'
import { Info } from './routes/info'
import { GetTrip } from './routes/trip/get'
import { ListTrips } from './routes/trip/list'
import { GetTripGeoJSON } from './routes/trip/geojson'


const app = new Hono()

// #region Middlewares
// Add CORS to all requests
app.use(
	'*',
	cors({
		origin: '*',
	})
)

// Simple Ok response
app.get('/api', Info)
app.get('/api/', Info)

// List trips
app.get('/api/trip', ListTrips)
app.get('/api/trip/', ListTrips)

// Get trip
app.get('/api/trip/:trip', GetTrip)

// Get trip geojson
app.get('/api/trip/:trip/geojson', GetTripGeoJSON)

// App
app.get(
	'/trip/',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/trip/:trip',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/trip/:trip/map',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/*',
	serveStatic({
		root: './app',
	})
)

export default app
