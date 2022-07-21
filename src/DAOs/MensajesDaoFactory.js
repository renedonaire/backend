import MensajesDaoFS from './MensajesDaoFS'
import MensajesDaoMongodb from './MensajesDaoMongodb'
import MensajesDaoSQL from './MensajesDaoSQL'

const rutaArchivo = '../databases/mensajes.txt'
const cnxStr = process.env.MONGO_cnxStr

// REVISAR esto
const opcion = process.argv[2] || 'Mongo'

let dao
switch (opcion) {
	case 'Mongo':
		dao = new MensajesDaoMongodb(cnxStr)
		await dao.init()
		break
	case 'SQL':
		dao = new MensajesDaoSQL()
		await dao.init()
		break
	default:
		dao = new MensajesDaoFS(rutaArchivo)
		await dao.init()
}

export default class MensajesDaoFactory {
	static getDao() {
		return dao
	}
}
