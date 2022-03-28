// Productos - inicial
const arrayProductos = [
	{
		title: 'La Vuelta al Mundo en 80 días',
		price: 15900,
		thumbnail:
			'https://www.antartica.cl/media/catalog/product/9/7/9788417127916_1.png?quality=80&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700&format=jpeg',
		id: 1,
	},
	{
		title: 'Primera Persona Del Singular',
		price: 19900,
		thumbnail:
			'https://www.antartica.cl/media/catalog/product/9/7/9789569961212_1.png?quality=80&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700&format=jpeg',
		id: 2,
	},
	{
		title: 'Ajuste De Cuentas',
		price: 15000,
		thumbnail:
			'https://www.antartica.cl/media/catalog/product/9/7/9789569646867_1.png?quality=80&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700&format=jpeg',
		id: 3,
	},
]

const getProducts = () => arrayProductos

const saveProduct = (product) => {
	arrayProductos.push(product)
}

module.exports = {
	getProducts,
	saveProduct,
}
