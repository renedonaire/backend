import ContenedorArchivo from '../../models/ContenedorArchivo.js'

export default class CarritosDaoArchivo extends ContenedorArchivo {
	constructor(rutaDir) {
		super(`${rutaDir}/carritos.json`)
	}
}
