const knex = require('knex')

module.exports = class Mensajes {
	constructor(config) {
		this.knex = knex(config)
	}

	crearTablaMensajes() {
		return this.knex.schema.dropTableIfExists('mensajes').then(() => {
			return this.knex.schema.createTable('mensajes', (table) => {
				table.increments('id').primary()
				table.string('autor', 50).notNullable()
				table.string('texto', 100).notNullable()
				table.string('fecha', 50).notNullable()
			})
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
