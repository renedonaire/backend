const fs = require('fs')
const { loggerError } = require('../logs/log4')

// REVISAR esto
module.exports = class ProductosDaoFS {
	constructor(ruta) {
		this.route = ruta
	}

	async getProductos() {
		try {
			const result = await fs.promises.readFile(this.route, 'utf-8')
			return JSON.parse(result)
		} catch (err) {
			await fs.promises.writeFile(this.route, JSON.stringify([], null, 2))
			const result = await fs.promises.readFile(route, 'utf-8')
			return JSON.parse(result)
		}
	}

	async saveProducto(producto) {
		const arrayProductos = await this.getProductos()
		try {
			arrayProductos.unshift(producto)
			await fs.promises.writeFile(
				this.route,
				JSON.stringify(arrayProductos, null, 2)
			)
			return arrayProductos
		} catch (err) {
			loggerError.error('Error al guardar: ', err)
		}
	}
}
