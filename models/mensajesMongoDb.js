const { MongoClient } = require('mongodb')
const { mongodb } = require('../src/options.js')
const { config } = require('dotenv')
config({ path: process.ENV })

const client = new MongoClient(process.env.MONGO_cnxStr, mongodb.options)
client.connect()
console.log('conectado a ', process.env.MONGO_cnxStr)

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
