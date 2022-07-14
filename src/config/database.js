const mongoose = require('mongoose')
const { config } = require('dotenv')
const { loggerConsola, loggerError } = require('../logs/log4')
config({ path: process.ENV })

mongoose
	.connect(process.env.MONGO_cnxStr, {
		useNewUrlParser: true,
	})
	.then((db) => loggerConsola.info('conectado a mongodb - usuarios'))
	.catch((err) =>
		loggerError.error(`Error al conectar a mongodb - usuarios: ${err}`)
	)
