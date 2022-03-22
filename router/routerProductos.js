const express = require('express')

module.exports = class Api {
	constructor() {
		this.arrayProductos = [
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
	}

	home = (req, res) => {
		res.status(200).render('home.ejs', { seccion: 'partials/form.ejs' })
	}

	cargaProducto = (req, res) => {
		const nuevo = this.addNew(req, res)
		res.status(200).render('home.ejs', { seccion: 'partials/form.ejs' })
	}

	listaProductos = (req, res) => {
		res
			.status(200)
			.render('home.ejs', {
				seccion: 'partials/list.ejs',
				list: this.arrayProductos,
			})
	}

	getAll = (req, res) => {
		res.status(200).json(this.arrayProductos)
	}

	getById = (req, res) => {
		const id = req.params.id
		const result = this.arrayProductos.find((e) => e.id == id)
		result
			? res.status(200).json({ result })
			: res.status(404).json({ error: 'producto no encontrado' })
	}

	addNew = (req, res) => {
		const { title, price, thumbnail } = req.body
		let ident = 0
		let indexArray = []
		this.arrayProductos.forEach((element) => indexArray.push(element.id))
		if (indexArray.length > 0) {
			const arraySorted = indexArray.sort((a, b) => b - a)
			ident = arraySorted[0] + 1
		} else {
			ident = 1
		}
		const response = {
			title: title,
			price: price,
			thumbnail: thumbnail,
			id: ident,
		}
		this.arrayProductos.push(response)
		// res.status(201).json(response)
		res.end
	}

	update = (req, res) => {
		const { title, price, thumbnail } = req.body
		const ident = req.params.id
		const producto = {
			title: title,
			price: price,
			thumbnail: thumbnail,
			id: ident,
		}
		const actualizado = this.arrayProductos[parseInt(ident) - 1]
		if (actualizado) {
			this.arrayProductos[parseInt(ident) - 1] = producto
			res.status(200).json({ actualizado: producto })
		} else {
			res.status(404).json({ error: 'producto no encontrado' })
		}
	}

	delete = (req, res) => {
		const id = req.params.id
		const [borrado] = this.arrayProductos.splice(parseInt(id) - 1, 1)
		borrado
			? res.status(200).json({ eliminado: borrado })
			: res.status(404).json({ error: 'producto no encontrado' })
	}

	error = (req, res) => {
		res.status(404).json({ error: 'ruta no existe' })
	}
}
