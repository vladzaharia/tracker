import { Context } from 'hono'
import { jwtVerify } from 'jose'
import { Bindings } from '../bindings'
import { AuthException } from './common'
import { findConfig } from '../tables/config'

export const getToken = (c: Context<{ Bindings: Bindings }>) => {
	const authorization = c.req.header('Authorization')
	const splitAuthorization = authorization?.split(' ')

	if (splitAuthorization && splitAuthorization.length > 1 && splitAuthorization[0] === 'Bearer') {
		return splitAuthorization[1]
	}

	throw new AuthException('Malformed Authorization header', 400)
}

export const verifyToken = async (c: Context<{ Bindings: Bindings }>, token: string) => {
	// Get oidc_secret from DB
	const config = await findConfig(c.env.D1DATABASE, 'oidc_client_secret')
	if (!config || config.value === '') {
		throw new AuthException('Could not find secret', 401)
	}

	try {
		return await jwtVerify(token, new TextEncoder().encode(config.value))
	} catch {
		throw new AuthException('Token could not be decoded', 401)
	}
}
