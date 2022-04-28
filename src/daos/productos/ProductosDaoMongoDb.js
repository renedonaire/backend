import { config } from 'dotenv'
config({ path: process.ENV })
import ContenedorMongoDb from '../../models/ContenedorMongoDb.js'

export default class ProductosDaoMongoDb extends ContenedorMongoDb {
	constructor(database, collection) {
		super(process.env.MONGO_database, process.env.MONGO_productos)
	}
}
