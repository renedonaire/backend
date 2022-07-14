const { MongoClient } = require('mongodb')
const { mongodatabase } = require('../config/options')
const { config } = require('dotenv')
config({ path: process.ENV })
const { loggerConsola, loggerWarning, loggerError } = require('../logs/log4.js')

const client = new MongoClient(process.env.MONGO_cnxStr, mongodatabase.options)
client.connect()
loggerConsola.info('conectado a mongodb - productos')

module.exports = class Productos {
	constructor(baseDatos, coleccion) {
		this.baseDatos = process.env.MONGO_database
		this.coleccion = process.env.MONGO_productos
	}

	async saveProduct(producto) {
		try {
			const result = await client
				.db(this.baseDatos)
				.collection(this.coleccion)
				.insertOne(producto)
			return { Estado: 'Guardado' }
		} catch (error) {
			return { 'Error al guardar ': `${error}` }
		}
	}

	async getProducts() {
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
