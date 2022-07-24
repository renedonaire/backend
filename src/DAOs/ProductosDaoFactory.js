const ProductosDaoFS = require('./ProductosDaoFS')
const ProductosDaoMongodb = require('./ProductosDaoMongodb')
const ProductosDaoSQL = require('./ProductosDaoSQL')

const rutaArchivo = '../databases/productos.txt'
const cnxStr = process.env.MONGO_cnxStr

// REVISAR esto
const opcion = process.argv[2] || 'Mongo'

// El Factory retorna un DAO basado en la opción elegida
// let dao
// switch (opcion) {
// 	case 'Mongo':
// 		dao = new ProductosDaoMongodb()
// 		await dao.init()
// 		break
// 	case 'SQL':
// 		dao = new ProductosDaoSQL()
// 		await dao.init()
// 		break
// 	default:
// 		dao = new ProductosDaoFS(rutaArchivo)
// 		await dao.init()
// }

// export default class ProductosDaoFactory {
// 	static getDao() {
// 		return dao
// 	}
// }

module.exports = class ProductosDaoFactory {
	static getDao() {
		let dao
		switch (opcion) {
			case 'Mongo':
				dao = new ProductosDaoMongodb()
				break
			case 'SQL':
				dao = new ProductosDaoSQL()
				break
			default:
				dao = new ProductosDaoFS(rutaArchivo)
		}
		return dao
	}
}
