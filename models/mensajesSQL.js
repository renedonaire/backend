const knex = require('knex')

module.exports = class Mensajes {
	constructor(config) {
		this.knex = knex(config)
	}

	crearTablaMensajes() {
		return this.knex.schema.hasTable('mensajes').then((exists) => {
			if (!exists) {
				console.log('Tabla Mensajes creada')
				return this.knex.schema.createTable('mensajes', (table) => {
					table.string('autor', 50).notNullable()
					table.string('texto', 100).notNullable()
					table.string('fecha', 50).notNullable()
				})
			} else {
				console.log('Tabla Mensajes ya existe')
				return this.knex.schema
			}
		})
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
