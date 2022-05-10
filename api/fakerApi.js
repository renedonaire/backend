const { faker } = require('@faker-js/faker')
faker.setLocale('es')

const unProducto = async () => {
	const product = await faker.commerce.product()
	const price = await faker.commerce.price()
	const image = await faker.image.imageUrl(640, 640, product)
	return { product, price, image }
}

const variosProductos = async (cantidad) => {
	let resultado = []
	for (let i = 1; i <= cantidad; i++) {
		resultado.push(await unProducto())
	}
	console.log(resultado)
	return resultado
}

module.exports = { variosProductos }
