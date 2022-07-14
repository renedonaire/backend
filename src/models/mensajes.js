const fs = require('fs')
const { loggerError } = require('../logs/log4')

module.exports = class Mensajes {
	constructor(ruta) {
		this.route = ruta
	}

	getMessages = async () => {
		try {
			const result = await fs.promises.readFile(this.route, 'utf-8')
			return JSON.parse(result)
		} catch (err) {
			await fs.promises.writeFile(this.route, JSON.stringify([], null, 2))
			const result = await fs.promises.readFile(route, 'utf-8')
			return JSON.parse(result)
		}
	}

	saveMessage = async (message) => {
		const arrayMessages = await this.getMessages()
		try {
			arrayMessages.unshift(message)
			await fs.promises.writeFile(
				this.route,
				JSON.stringify(arrayMessages, null, 2)
			)
			return arrayMessages
		} catch (err) {
			loggerError.error('Error al guardar: ', err)
		}
	}
}
