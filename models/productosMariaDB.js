const knex = require('knex')
const productosInicial = require('./valoresIniciales.js')

module.exports = class Productos {
	constructor(config) {
		this.knex = knex(config)
	}

	crearTablaProductos() {
		return this.knex.schema.dropTableIfExists('productos').then(() => {
			return this.knex.schema.createTable('productos', (table) => {
				table.increments('id').primary()
				table.string('title', 1000).notNullable()
				table.integer('price').notNullable()
				table.string('thumbnail', 1000).notNullable()
			})
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
