import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { cors } from 'hono/cors'
import { Info } from './routes/info'
import { GetTrip } from './routes/trip/get'
import { ListTrips } from './routes/trip/list'
import { FetchGeoJSON } from './cron/fetch_geojson'
import { Bindings } from './bindings'
import { GetTripGeoJSONPoints } from './routes/trip/geojson/points'
import { GetTripGeoJSONTrack } from './routes/trip/geojson/track'

const app = new Hono<{ Bindings: Bindings }>()

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
app.get('/api/trip/:trip/geojson/points', GetTripGeoJSONPoints)
app.get('/api/trip/:trip/geojson/track', GetTripGeoJSONTrack)

// App
app.get(
	'/:tripId',
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

export default {
	fetch: app.fetch,
	async scheduled(event, env, ctx) {
		ctx.waitUntil(FetchGeoJSON(env))
	},
} as ExportedHandler<Bindings>
