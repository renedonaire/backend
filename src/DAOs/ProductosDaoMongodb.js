const MongoDbConnection = require('../config/database')
const { loggerConsola } = require('../logs/log4.js')

loggerConsola.info('ProductosDaoMongodb')

module.exports = class ProductosDaoMongodb {
	constructor(baseDatos, coleccion) {
		this.baseDatos = process.env.MONGO_database
		this.coleccion = process.env.MONGO_productos
	}

	async saveProduct(producto) {
		try {
			this.client = await MongoDbConnection.Get()
			const result = await this.client
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
			console.log('getProducts')
			this.client = await MongoDbConnection.Get()
			const result = await this.client
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
