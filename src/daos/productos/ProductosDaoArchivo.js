import ContenedorArchivo from '../../models/ContenedorArchivo.js'

export default class ProductosDaoArchivo extends ContenedorArchivo {
	constructor(rutaDir) {
		super(`${rutaDir}/productos.json`)
	}
}
