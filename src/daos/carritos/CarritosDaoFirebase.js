import { config } from 'dotenv'
config({ path: process.ENV })
import ContenedorFirebase from '../../models/ContenedorFirebase.js'

export default class CarritosDaoFirebase extends ContenedorFirebase {
	constructor(coleccion) {
		super(process.env.FIREBASE_carritos)
	}
}
