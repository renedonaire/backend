import { config } from 'dotenv'
config({ path: process.ENV })
import ContenedorFirebase from '../../models/ContenedorFirebase.js'

export default class ProductosDaoFirebase extends ContenedorFirebase {
	constructor(coleccion) {
		super(process.env.FIREBASE_productos)
	}
}
