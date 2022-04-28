import config from '../config.js'

let productosDao, carritosDao

switch (config.PERS) {
	case 'file':
		const { default: ProductosDaoArchivo } = await import(
			'./productos/ProductosDaoArchivo.js'
		)
		const { default: CarritosDaoArchivo } = await import(
			'./carritos/CarritosDaoArchivo.js'
		)
		productosDao = new ProductosDaoArchivo(config.fileSystem.path)
		carritosDao = new CarritosDaoArchivo(config.fileSystem.path)
		console.log('Persistencia en archivo')
		break
	case 'firebase':
		const { default: ProductosDaoFirebase } = await import(
			'./productos/ProductosDaoFirebase.js'
		)
		const { default: CarritosDaoFirebase } = await import(
			'./carritos/CarritosDaoFirebase.js'
		)
		productosDao = new ProductosDaoFirebase()
		carritosDao = new CarritosDaoFirebase()
		console.log('Persistencia en firebase')
		break
	case 'mongodb':
		const { default: ProductosDaoMongoDb } = await import(
			'./productos/ProductosDaoMongoDb.js'
		)
		const { default: CarritosDaoMongoDb } = await import(
			'./carritos/CarritosDaoMongoDb.js'
		)
		productosDao = new ProductosDaoMongoDb()
		carritosDao = new CarritosDaoMongoDb()
		console.log('Persistencia en mongodb')
		break
	default:
		const { default: ProductosDaoMem } = await import(
			'./productos/ProductosDaoMem.js'
		)
		const { default: CarritosDaoMem } = await import(
			'./carritos/CarritosDaoMem.js'
		)
		productosDao = new ProductosDaoMem()
		carritosDao = new CarritosDaoMem()
		console.log('Persistencia en memoria')
		break
}

export { productosDao, carritosDao }
