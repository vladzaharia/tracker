import { Context } from 'hono'
import { Bindings } from './bindings'
import { value } from 'jsonpath'

export const BASE_URL = 'https://test.track.vlad.gg'

export const json = (response: unknown, status = 200) => {
	return {
		json: () => response,
		status,
	}
}

export const createContext = (overrides?: Partial<Context<{ Bindings: Bindings }>>) => {
	return {
		...overrides,
		env: {
			BASE_URL: BASE_URL,
			ENVIRONMENT: 'test',
			TRACKER_SECRET: 'env-test-secret',
			GEOJSON: {
				get: async () => 'kv-test-secret',
			},
			...overrides?.env,
		} as Bindings,
		json,
	} as Context<{ Bindings: Bindings }>
}

export const modifyContext = (context: Context<{ Bindings: Bindings }>, key: string, newValue: unknown) => {
	value(context, key, newValue)
}
