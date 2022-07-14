const { createTransport } = require('nodemailer')
const { loggerError, loggerConsola } = require('../logs/log4')

const enviarMail = async (to, subject, body) => {
	const transporter = await createTransport({
		host: 'mail.smtp2go.com',
		port: 2525,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	})

	try {
		const info = await transporter.sendMail({
			from: 'backend@coder.cl',
			to: `${to}`,
			subject: `${subject}`,
			html: `${body}`,
		})
		loggerConsola.info('Email enviado: %s', info.messageId)
	} catch (error) {
		loggerError.error(error)
	}
}

module.exports = { enviarMail }
