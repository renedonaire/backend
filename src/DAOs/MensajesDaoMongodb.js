const Mensaje = require('../models/mensajeSchema')
const { loggerConsola, loggerError } = require('../logs/log4.js')

loggerConsola.info('MensajesDaoMongodb')

module.exports = class MensajesDaoMongodb {
	constructor() {
		this.Mensaje = Mensaje
	}

	async getMessages() {
		try {
			console.log('getMessages. this.Mensaje: ', this.Mensaje)
			const mensajes = await this.Mensaje.find().toArray()
			console.log('mensajes: ', mensajes)
			return mensajes
		} catch (error) {
			loggerError.error(`Error en getMessages: ${error}`)
			return { Error: `${error}` }
		}
	}

	async saveMessage(mensajes) {
		try {
			this.client = await MongoDbConnection.Get()
			const result = await this.client
				.db(this.baseDatos)
				.collection(this.coleccion)
				.insertOne(mensajes)
			return { Estado: 'Guardado' }
		} catch (error) {
			return { 'Error al guardar ': `${error}` }
		}
	}
}
