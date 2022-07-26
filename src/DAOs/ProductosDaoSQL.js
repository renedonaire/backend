const knex = require('knex')
const { loggerConsola } = require('../logs/log4.js')

module.exports = class ProductosDaoSQL {
	constructor(config) {
		this.knex = knex(config)
	}

	crearTablaProductos() {
		return this.knex.schema.hasTable('productos').then((exists) => {
			if (!exists) {
				loggerConsola.info('Tabla Productos creada')
				return this.knex.schema.createTable('productos', (table) => {
					table.string('title', 100).notNullable()
					table.number('price').notNullable()
					table.string('thumbnail', 200).notNullable()
				})
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
		return this.knex('mensajes').insert(mensajes)
	}

	getProducts() {
		return this.knex('productos').select('*')
	}
}
