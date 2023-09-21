import { Migration } from '../types'
import { MIGRATION_0_INITIAL } from './0-initial'
import { MIGRATION_1_EXISTING_TRIPS } from './1-existing-trips'
import { MIGRATION_2_WAYPOINTS } from './2-waypoints'
import { MIGRATION_3_ADD_WAYPOINTS } from './3-add-waypoints'
import { MIGRATION_4_CONFIG } from './4-config'
import { MIGRATION_5_OIDC_CONFIG } from './5-oidc-config'
import { MIGRATION_6_MAPBOX_CONFIG } from './6-mapbox-config'
import { MIGRATION_7_PROMINENT_WAYPOINTS } from './7-prominent-waypoints'
import { MIGRATION_8_FETCH_INFO } from './8-fetch-info'
import { MIGRATION_9_TRIP_POINTS } from './9-trip-points'

export function getAllMigrations(): Migration[] {
	return [
		MIGRATION_0_INITIAL,
		MIGRATION_1_EXISTING_TRIPS,
		MIGRATION_2_WAYPOINTS,
		MIGRATION_3_ADD_WAYPOINTS,
		MIGRATION_4_CONFIG,
		MIGRATION_5_OIDC_CONFIG,
		MIGRATION_6_MAPBOX_CONFIG,
		MIGRATION_7_PROMINENT_WAYPOINTS,
		MIGRATION_8_FETCH_INFO,
		MIGRATION_9_TRIP_POINTS,
	]
}
