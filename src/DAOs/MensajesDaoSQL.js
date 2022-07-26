const knex = require('knex')
const { loggerConsola } = require('../logs/log4.js')

module.exports = class MensajesDaoSQL {
	constructor(config) {
		this.knex = knex(config)
	}

	crearTablaMensajes() {
		return this.knex.schema.hasTable('mensajes').then((exists) => {
			if (!exists) {
				loggerConsola.info('Tabla Mensajes creada')
				return this.knex.schema.createTable('mensajes', (table) => {
					table.string('autor', 50).notNullable()
					table.string('texto', 100).notNullable()
					table.string('fecha', 50).notNullable()
				})
			} else {
				loggerConsola.info('Tabla Mensajes ya existe')
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
