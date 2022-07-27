const MensajesDaoFS = require('./MensajesDaoFS')
const MensajesDaoMongodb = require('./MensajesDaoMongodb')
const MensajesDaoSQL = require('./MensajesDaoSQL')

const rutaArchivo = '../databases/mensajes.txt'
const cnxStr = process.env.MONGO_cnxStr

// REVISAR esto
const opcion = process.argv[2] || 'Mongo'

// El Factory retorna un DAO basado en la opción elegida
module.exports = class MensajesDaoFactory {
	static getDao() {
		let dao
		switch (opcion) {
			case 'Mongo':
				dao = new MensajesDaoMongodb()
				break
			case 'SQL':
				dao = new MensajesDaoSQL()
				break
			default:
				dao = new MensajesDaoFS(rutaArchivo)
		}
		return dao
	}
}
