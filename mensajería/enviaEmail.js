const nodemailer = require('nodemailer')
const { loggerError } = require('../logs/log4')

const enviarMail = async (to, subject, body) => {
	const transporter = nodemailer.createTransport({
		host: 'mail.smtp2go.com',
		port: 2525,
		secure: false,
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
			text: `${body}`,
		})
		console.log('Message sent: %s', info.messageId)
	} catch (error) {
		loggerError.error(error)
	}
}

module.exports = { enviarMail }
