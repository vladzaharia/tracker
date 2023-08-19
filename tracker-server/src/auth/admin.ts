import { Context } from 'hono'
import { Bindings } from '../bindings'
import { getToken, verifyToken } from './jwt'

export const AdminAuth = async (c: Context<{ Bindings: Bindings }>) => {
	const verifiedToken = await verifyToken(c, getToken(c))

	console.log('Admin Auth')
	return ((await verifiedToken).payload as unknown as JWTClaims)?.tracker?.admin
}

interface JWTClaims {
	tracker: {
		admin: boolean
		user: boolean
	}
	first_name: string
}
