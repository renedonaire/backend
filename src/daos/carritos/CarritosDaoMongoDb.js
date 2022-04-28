import { config } from 'dotenv'
config({ path: process.ENV })
import ContenedorMongoDb from '../../models/ContenedorMongoDb.js'

export default class CarritosDaoMongoDb extends ContenedorMongoDb {
	constructor(database, collection) {
		super(process.env.MONGO_database, process.env.MONGO_carritos)
	}
}
