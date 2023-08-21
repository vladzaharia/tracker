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
import { AddTrip } from './routes/trip/add'
import { UpdateTrip } from './routes/trip/update'
import { DeleteTrip } from './routes/trip/delete'
import { AuthMiddleware } from './auth/auth'
import { ListWaypoints } from './routes/waypoint/list'
import { GetWaypoint } from './routes/waypoint/get'
import { UpdateWaypoint } from './routes/waypoint/update'
import { FetchWaypoints } from './cron/fetch_waypoints'
import { AddWaypoint } from './routes/waypoint/add'
import { DeleteWaypoint } from './routes/waypoint/delete'
import { ListTripInfo } from './routes/trip/all'
import { updateLastFetchTime } from './tables/config'
import { ListConfigs } from './routes/config/list'
import { GetConfig } from './routes/config/get'
import { UpdateConfig } from './routes/config/update'

const app = new Hono<{ Bindings: Bindings }>()

// #region Middlewares
// Add CORS to all requests
app.use(
	'*',
	cors({
		origin: '*',
	})
)

// JWT Authentication for specific paths
app.use('/api/*', AuthMiddleware)
// #endregion

// Simple Ok response
app.get('/api', Info)
app.get('/api/', Info)

// List trips
app.get('/api/trip', ListTrips)
app.get('/api/trip/', ListTrips)
app.get('/api/trip/all', ListTripInfo)

// Trip routes
app.get('/api/trip/:trip', GetTrip)
app.post('/api/trip/:trip', AddTrip)
app.patch('/api/trip/:trip', UpdateTrip)
app.delete('/api/trip/:trip', DeleteTrip)

// Get trip geojson
app.get('/api/trip/:trip/geojson/points', GetTripGeoJSONPoints)
app.get('/api/trip/:trip/geojson/track', GetTripGeoJSONTrack)

// Actions
app.put('/api/action/message', SendMessage)

// Waypoints
app.get('/api/waypoint', ListWaypoints)
app.get('/api/waypoint/', ListWaypoints)
app.get('/api/waypoint/:trip/:timestamp', GetWaypoint)
app.post('/api/waypoint/:trip/:timestamp', AddWaypoint)
app.patch('/api/waypoint/:trip/:timestamp', UpdateWaypoint)
app.delete('/api/waypoint/:trip/:timestamp', DeleteWaypoint)

// Config
app.get('/api/config', ListConfigs)
app.get('/api/config/', ListConfigs)
app.get('/api/config/:id', GetConfig)
app.patch('/api/config/:id', UpdateConfig)

// Database endpoints
app.get('/api/db', DbInfo)
app.put('/api/db/migrate', MigrateDb)
app.put('/api/db/rollback', RollbackDb)
app.put('/api/db/reset', ResetDb)

// OpenAPI
app.get(
	'/api/openapi/openapi.swagger',
	serveStatic({
		path: './openapi/openapi.swagger',
	})
)

// App
app.get(
	'/:tripId',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/admin',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/admin/trip',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/admin/trip/:tripIdAdmin',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/admin/waypoint',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/admin/waypoint/:waypointTrip/:waypointTimestamp',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/admin/config',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/admin/database',
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
		ctx.waitUntil(FetchWaypoints(env))
		ctx.waitUntil(updateLastFetchTime(env.D1DATABASE))
	},
} as ExportedHandler<Bindings>
