const { config } = require('dotenv')
import twilio from 'twilio'

const sendWS = async (to, body) => {
	const accountSid = process.env.TWILIO_ACCOUNT_SID
	const authToken = process.env.TWILIO_AUTH_TOKEN
	const client = twilio(accountSid, authToken)

	const options = {
		body: body,
		from: process.env.TWILIO_FROM,
		to: to,
	}

	try {
		const message = await client.messages.create(options)
		console.log(message)
	} catch (error) {
		console.log(error)
	}
}

module.exports = sendWS
