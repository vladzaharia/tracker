export type HTTPMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type AuthType = 'gm' | 'player' | 'admin'

export interface SecureEndpoint {
	path: RegExp
	methods: HTTPMethods[]
	authTypes: AuthType[]
}

export function getSecureEndpoints(): SecureEndpoint[] {
	return [
		{
			path: /config.*$/,
			methods: ['PATCH'],
			authTypes: ['admin'],
		},
		{
			path: /db.*$/,
			methods: ['POST', 'PUT', 'DELETE'],
			authTypes: ['admin'],
		},
		{
			path: /trip\/\w*$/,
			methods: ['POST', 'PATCH', 'DELETE'],
			authTypes: ['admin'],
		},
		{
			path: /waypoint\/\w*$/,
			methods: ['PATCH'],
			authTypes: ['admin'],
		},
	]
}
