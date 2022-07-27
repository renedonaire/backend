const mongoose = require('mongoose')
const { config } = require('dotenv')
const { loggerConsola, loggerError } = require('../logs/log4')
const { mongoOptions } = require('../config/options')
config({ path: process.ENV })

const MongoDbConnection = () => {
	let db = null

	async function DbConnect() {
		try {
			const _db = await mongoose.connect(process.env.MONGO_cnxStr, mongoOptions)
			return _db
		} catch (e) {
			loggerError.error(e)
			return e
		}
	}

	async function Get() {
		try {
			if (db != null) {
				loggerConsola.info(`Ya existe conexión con la base de datos`)
				return db
			} else {
				loggerConsola.info(`Obteniendo una conexión con la base de datos`)
				db = await DbConnect()
				return db
			}
		} catch (e) {
			loggerError.error(e)
			return e
		}
	}

	return {
		Get: Get,
	}
}

module.exports = MongoDbConnection()
