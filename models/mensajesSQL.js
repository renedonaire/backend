const knex = require('knex')
const mensajesInicial = require('./valoresIniciales.js')

module.exports = class Mensajes {
	constructor(config) {
		this.knex = knex(config)
	}

	crearTablaMensajes() {
		if (!this.knex.schema.hasTable('mensajes')) {
			this.knex.schema.createTable('mensajes', (table) => {
				table.increments('id').primary()
				table.string('autor', 50).notNullable()
				table.string('texto', 100).notNullable()
				table.string('fecha', 50).notNullable()
			})
			mensajes.saveMessage(mensajesInicial)
			console.log('Tabla mensajes creada')
			return this.knex.schema
		} else {
			console.log('Tabla mensajes ya existe')
			return this.knex.schema
		}
	}

	cerrarBDMensajes() {
		return this.knex.destroy()
	}

	saveMessage(mensajes) {
		return this.knex('mensajes').insert(mensajes)
	}

	getMessages() {
		return this.knex('mensajes').select('*')
	}
}
