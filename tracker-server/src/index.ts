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
import { SendMessage } from './routes/action/message'
import { DbInfo } from './routes/db/info'
import { MigrateDb } from './routes/db/migrate'
import { ResetDb } from './routes/db/reset'
import { RollbackDb } from './routes/db/rollback'

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

// Actions
app.put('/api/action/message', SendMessage)

// Database endpoints
app.get('/api/db', DbInfo)
app.put('/api/db/migrate', MigrateDb)
app.put('/api/db/rollback', RollbackDb)
app.put('/api/db/reset', ResetDb)

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
