const axios = require('axios')

const data = {
	title: 'TEST title',
	price: '1000',
	thumbnail:
		'https://toppng.com/uploads/preview/book-icon-11550248850zvu72lpyxc.png',
	code: '999',
}

obtenerProductos = async () => {
	const response = await axios.get('http://localhost:8080/api/productos')
	console.log(response.data)
	return response.data
}

obtenerProductos()
