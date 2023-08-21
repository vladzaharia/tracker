import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { getCurrentTrip } from '../../migrate/migrations/existing-trips/trip'
import { sendMessage } from '../../inreach/message'

interface SendMessageBody {
	phoneNumber: string
	message: string
}

export const SendMessage = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { phoneNumber, message } = await c.req.json<SendMessageBody>()

		// Check if there's an active trip
		if (!getCurrentTrip(c.env.ENVIRONMENT)) {
			return c.json({ message: 'You can only do this during a current trip!' }, 404)
		}

		// Check inputs
		if (!phoneNumber) {
			return c.json({ message: 'You must provide a phone number!' }, 400)
		}
		if (!message) {
			return c.json({ message: 'You must provide a message!' }, 400)
		}
		if (message.length > 160) {
			return c.json({ message: 'Message must be 160 or fewer characters!' }, 400)
		}

		// Send message
		await sendMessage(c.env, phoneNumber, message)
		return c.json({ message: 'Successfully sent message!' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
