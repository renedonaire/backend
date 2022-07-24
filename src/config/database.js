const mongoose = require('mongoose')
const { config } = require('dotenv')
const { loggerConsola, loggerError } = require('../logs/log4')
config({ path: process.ENV })

// Se espera que retonerne una instancia de mongoose
module.exports = class Mongodb {
	static instancia
	constructor() {
		if (!Mongodb.instancia) {
			Mongodb.instancia = mongoose
				.connect(process.env.MONGO_cnxStr, {
					useNewUrlParser: true,
				})
				.then((db) => loggerConsola.info('conectado a mongodb'))
				.catch((err) =>
					loggerError.error(`Error al conectar a mongodb: ${err}`)
				)
			return Mongodb.instancia
		} else {
			return Mongodb.instancia
		}
	}
}
