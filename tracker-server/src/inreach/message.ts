import { findConfig } from '../tables/config'
import { Bindings } from '../bindings'

export const sendMessage = async (env: Bindings, phoneNumber: string, message: string) => {
	// Get Garmin Username
	const config = await findConfig(env.D1DATABASE, 'garmin_username')
	if (!config) {
		throw new Error('Garmin username not found!')
	}

	const formData = new FormData()
	formData.append('deviceIds', '1038481')
	formData.append('fromAddr', phoneNumber.includes('+1') ? phoneNumber : `+1${phoneNumber}`)
	formData.append('messageText', message)

	const response = await fetch(`https://share.garmin.com/${config.value}/Map/SendMessageToDevices`, {
		method: 'POST',
		body: formData,
	})

	return response
}
