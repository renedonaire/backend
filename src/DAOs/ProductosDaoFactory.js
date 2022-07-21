import ProductosDaoFS from './ProductosDaoFS'
import ProductosDaoMongodb from './ProductosDaoMongodb'
import ProductosDaoSQL from './ProductosDaoSQL'

const rutaArchivo = '../databases/productos.txt'
const cnxStr = process.env.MONGO_cnxStr

// REVISAR esto
const opcion = process.argv[2] || 'Mongo'

let dao
switch (opcion) {
	case 'Mongo':
		dao = new ProductosDaoMongodb(cnxStr)
		await dao.init()
		break
	case 'SQL':
		dao = new ProductosDaoSQL()
		await dao.init()
		break
	default:
		dao = new ProductosDaoFS(rutaArchivo)
		await dao.init()
}

export default class ProductosDaoFactory {
	static getDao() {
		return dao
	}
}
