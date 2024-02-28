import { HTTPException } from 'hono/http-exception'
import { StatusCode } from 'hono/utils/http-status'

export class AuthException extends HTTPException {
	constructor(message: string, status: StatusCode) {
		const res = new Response(message, { status })
		super(status, { res })
	}
}
