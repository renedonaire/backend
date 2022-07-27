const MongoDbConnection = require('../config/database')
const { loggerConsola } = require('../logs/log4.js')

loggerConsola.info('MensajesDaoMongodb')

module.exports = class MensajesDaoMongodb {
	constructor() {
		this.baseDatos = process.env.MONGO_database
		this.coleccion = process.env.MONGO_mensajes
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

	async getMessages() {
		try {
			console.log('getMessages')
			this.client = await MongoDbConnection.Get()
			const result = await this.client
				.db(this.baseDatos)
				.collection(this.coleccion)
				.find()
				.toArray()
			console.log(result)
			return result
		} catch (error) {
			return { Error: `${error}` }
		}
	}
}
