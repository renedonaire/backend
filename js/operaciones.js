const fs = require('fs')

module.exports = class Products {
	constructor(fileName) {
		this.route = fileName
	}

	getAll = async () => {
		try {
			const result = await fs.promises.readFile(this.route, 'utf-8')
			return JSON.parse(result)
		} catch (err) {
			await fs.promises.writeFile(this.route, JSON.stringify([], null, 2))
			const result = await fs.promises.readFile(this.route, 'utf-8')
			return JSON.parse(result)
		}
	}

	saveProduct = async (product) => {
		const arrayProducts = await this.getAll()
		try {
			let indexArray = []
			arrayProducts.forEach((element) => indexArray.push(element.id))
			if (indexArray.length > 0) {
				const arraySorted = indexArray.sort((a, b) => b - a)
				product.id = arraySorted[0] + 1
				arrayProducts.push(product)
			} else {
				product.id = 1
				arrayProducts.push(product)
			}
			await fs.promises.writeFile(
				this.route,
				JSON.stringify(arrayProducts, null, 2)
			)
			return product.id
		} catch (err) {
			console.log('Error al guardar: ', err)
		}
	}

	getById = async (index) => {
		try {
			const arrayProducts = await this.getAll()
			const result = arrayProducts.find((e) => e.id === index)
			if (result) {
				return result
			} else {
				return null
			}
		} catch (err) {
			console.log('Error al obtener por id: ' + err)
		}
	}

	deleteById = async (index) => {
		try {
			const arrayProducts = await this.getAll()
			const filteredArray = arrayProducts.filter((e) => e.id != index)
			if (filteredArray.length < arrayProducts.length) {
				await fs.promises.writeFile(
					this.route,
					JSON.stringify(filteredArray, null, 2)
				)
				console.log('Registro num. ' + index + ' eliminado exitosamente')
			} else {
				return null
			}
		} catch (err) {
			console.log('Error al borrar por id: ' + err)
		}
	}

	deleteAll = async () => {
		try {
			const arrayProducts = []
			await fs.promises.writeFile(
				this.route,
				JSON.stringify(arrayProducts, null, 2)
			)
			return console.log('Todos los registros eliminados')
		} catch (err) {
			console.log('Error al borrar todo: ' + err)
		}
	}
}
