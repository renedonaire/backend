// const { MongoClient } = require('mongodb')
// const { mongodatabase } = require('../config/options')
const Mongodb = require('../config/database')
// config({ path: process.ENV })
const { loggerConsola } = require('../logs/log4.js')

// const client = new MongoClient(process.env.MONGO_cnxStr, mongodatabase.options)
const client = new Mongodb()
// client.connect()
loggerConsola.info('conectado a mongodb - mensajes')

module.exports = class MensajesDaoMongodb {
	constructor(baseDatos, coleccion) {
		this.baseDatos = process.env.MONGO_database
		this.coleccion = process.env.MONGO_mensajes
	}

	async saveMessage(mensajes) {
		try {
			const result = await client
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
			const result = await client
				.db(this.baseDatos)
				.collection(this.coleccion)
				.find()
				.toArray()
			return result
		} catch (error) {
			return { Error: `${error}` }
		}
	}
}
