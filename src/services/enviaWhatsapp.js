const twilio = require('twilio')
const { loggerError, loggerConsola } = require('../logs/log4')

const enviarWS = async (to, body) => {
	const accountSid = process.env.TWILIO_ACCOUNT_SID
	const authToken = process.env.TWILIO_AUTH_TOKEN
	const client = twilio(accountSid, authToken)

	const options = {
		body: body,
		from: process.env.TWILIO_FROM_WS,
		to: to,
	}

	try {
		const message = await client.messages.create(options)
		loggerConsola.info('Whatsapp enviado: %s', message.sid)
	} catch (error) {
		loggerError.error(error)
	}
}

module.exports = { enviarWS }
