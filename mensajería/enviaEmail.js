const { config } = require('dotenv')
const nodemailer = require('nodemailer')

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

	const info = await transporter.sendMail({
		from: 'backend@coder.cl',
		to: `${to}`,
		subject: `${subject}`,
		text: `${body}`,
	})

	console.log('Message sent: %s', info.messageId)
}

module.exports = { enviarMail }
