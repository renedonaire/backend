const mongoose = require('mongoose')
const { config } = require('dotenv')
const { loggerConsola, loggerError } = require('../logs/log4')
const { mongoOptions } = require('../config/options')
config({ path: process.ENV })
const MongoClient = require('mongodb').MongoClient

const MongoDbConnection = () => {
	let db = null
	let instance = 0

	async function DbConnect() {
		try {
			let url = process.env.MONGO_cnxStr
			let _db = await MongoClient.connect(url)
			return _db
		} catch (e) {
			return e
		}
	}

	async function Get() {
		try {
			instance++ // this is just to count how many times our singleton is called.
			console.log(`MongoDbConnection called ${instance} times`)
			if (db != null) {
				console.log(`db connection is already alive`)
				return db
			} else {
				console.log(`getting new db connection`)
				db = await DbConnect()
				return db
			}
		} catch (e) {
			return e
		}
	}

	return {
		Get: Get,
	}
}

module.exports = MongoDbConnection()

// module.exports = class Mongodb {
// 	static instancia
// 	constructor() {
// 		if (!Mongodb.instancia) {
// 			Mongodb.instancia = mongoose
// 				.connect(process.env.MONGO_cnxStr, { mongoOptions })
// 				.then((db) => {
// 					// loggerConsola.info('Creada instancia de mongodb')
// 					console.log('NEW Mongodb.instancia', Mongodb.instancia)
// 					return Mongodb.instancia
// 				})
// 				.catch((err) =>
// 					loggerError.error(`Error al conectar a mongodb: ${err}`)
// 				)
// 		} else {
// 			console.log('OLD Mongodb.instancia', Mongodb.instancia)
// 			return Mongodb.instancia
// 		}
// 	}
// }
