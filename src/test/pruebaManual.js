const axios = require('axios')
const { resolve } = require('node:path/win32')

const data = {
	title: 'TEST title',
	price: '1000',
	thumbnail:
		'https://toppng.com/uploads/preview/book-icon-11550248850zvu72lpyxc.png',
	code: '999',
}
agregarProducto = async () => {
	try {
		const result = await axios.post(
			'http://localhost:8080/api/saveProduct',
			data
		)
		console.log(result.data)
	} catch (error) {
		console.log(error)
	}
}

obtenerProductos = async () => {
	try {
		const result = await axios.get('http://localhost:8080/api/getProducts')
		console.log(result.data)
	} catch (error) {
		console.log(error)
	}
}

const newData = {
	title: 'NEW test title',
	price: '2000',
	thumbnail:
		'https://toppng.com/uploads/preview/book-icon-11550248850zvu72lpyxc.png',
	code: '999',
}
actualizarProducto = async () => {
	try {
		const result = await axios.put(
			'http://localhost:8080/api/updateProduct',
			newData
		)
		console.log(result.data)
	} catch (error) {
		console.log(error)
	}
}

borrarProducto = async () => {
	try {
		const result = await axios.delete(
			'http://localhost:8080/api/deleteProduct/999'
		)
		console.log(result.data)
	} catch (error) {
		console.log(error)
	}
}

console.log('Iniciando prueba manual')
Promise.all([
	agregarProducto(),
	obtenerProductos(),
	actualizarProducto(),
	borrarProducto(),
])
	.then(() => {
		console.log('Prueba manual finalizada')
	})
	.catch((error) => {
		console.log(error)
	})
