const { MongoClient } = require('mongodb')
const { mongodatabase } = require('../config/options')
const { config } = require('dotenv')
config({ path: process.ENV })
const { loggerConsola, loggerWarning, loggerError } = require('../logs/log4.js')

const client = new MongoClient(process.env.MONGO_cnxStr, mongodatabase.options)
client.connect()
loggerConsola.info('conectado a mongodb - mensajes')

module.exports = class Mensajes {
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
