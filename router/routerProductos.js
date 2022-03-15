const express = require('express')
// const { Router } = require('express')
// const routerProductos = Router()

module.exports = class Router {
	constructor() {
		this.arrayProductos = [
			{
				title: 'La Vuelta al Mundo en 80 días',
				price: 15900,
				thumbnail: 'https://images/vuelta.jpg',
				id: 1,
			},
			{
				title: 'Primera Persona Del Singular',
				price: 19900,
				thumbnail: 'https://images/primera.jpeg',
				id: 2,
			},
			{
				title: 'Ajuste De Cuentas',
				price: 15000,
				thumbnail: 'https://images/ajuste.jpeg',
				id: 3,
			},
		]
	}

	getAll = (req, res) => {
		res.json(this.arrayProductos)
	}
}

// routerProductos.get('/:id', (req, res) => {
// 	const { id } = req.params
// 	const result = arrayProductos[parseInt(id) - 1]
// 	result ? res.json({ result }) : res.json({ error: 'producto no encontrado' })
// })

// routerProductos.post('/', (req, res) => {
// 	const { title, price, thumbnail } = req.body
// 	let ident = 0
// 	let indexArray = []
// 	arrayProductos.forEach((element) => indexArray.push(element.id))
// 	if (indexArray.length > 0) {
// 		const arraySorted = indexArray.sort((a, b) => b - a)
// 		ident = arraySorted[0] + 1
// 	} else {
// 		ident = 1
// 	}
// 	const response = {
// 		title: title,
// 		price: price,
// 		thumbnail: thumbnail,
// 		id: ident,
// 	}
// 	arrayProductos.push(response)
// 	res.json(response)
// })

// routerProductos.put('/:id', (req, res) => {
// 	const { title, price, thumbnail } = req.body
// 	const { ident } = req.params
// 	const producto = {
// 		title: title,
// 		price: price,
// 		thumbnail: thumbnail,
// 		id: ident,
// 	}
// 	const actualizado = arrayProductos[parseInt(ident) - 1]
// 	if (actualizado) {
// 		arrayProductos[parseInt(ident) - 1] = producto
// 		res.json({ actualizado: producto })
// 	} else {
// 		res.json({ error: 'producto no encontrado' })
// 	}
// })

// routerProductos.delete('/:id', (req, res) => {
// 	const { id } = req.params
// 	const [borrado] = arrayProductos.splice(parseInt(id) - 1, 1)
// 	borrado
// 		? res.json({ eliminado: borrado })
// 		: res.json({ error: 'producto no encontrado' })
// })

// module.exports = routerProductos
