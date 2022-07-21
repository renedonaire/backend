const knex = require('knex')
const productosInicial = require('./valoresIniciales.js')
const { loggerConsola, loggerWarning, loggerError } = require('../logs/log4.js')

module.exports = class ProductosDaoMariadb {
	constructor(config) {
		this.knex = knex(config)
	}

	crearTablaProductos() {
		return this.knex.schema.hasTable('productos').then((exists) => {
			if (!exists) {
				this.knex.schema.createTable('productos', (table) => {
					table.increments('id').primary()
					table.string('title', 1000).notNullable()
					table.integer('price').notNullable()
					table.string('thumbnail', 1000).notNullable()
				})
				loggerConsola.info('Tabla Productos creada')
				return this.knex('productos').saveProduct(productosInicial)
			} else {
				loggerConsola.info('Tabla Productos ya existe')
				return this.knex.schema
			}
		})
	}

	cerrarBDProductos() {
		return this.knex.destroy()
	}

	saveProduct(productos) {
		return this.knex('productos').insert(productos)
	}

	getProducts() {
		return this.knex('productos').select('*')
	}
}
