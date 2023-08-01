const MESSAGE_URL = 'https://share.garmin.com/mynameisvlad/Map/SendMessageToDevices'

export const sendMessage = async (phoneNumber: string, message: string) => {
	const formData = new FormData()
	formData.append('deviceIds', '1038481')
	formData.append('fromAddr', phoneNumber.includes('+1') ? phoneNumber : `+1${phoneNumber}`)
	formData.append('messageText', message)

	const response = await fetch(MESSAGE_URL, {
		method: 'POST',
		body: formData,
	})

	return response
}
