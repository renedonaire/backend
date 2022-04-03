import express from 'express'
import Router from 'express'
const routerProductos = Router()
import { userLevel } from '../data/userLevel.js'
import {
	saveProduct,
	getProducts,
	updateProduct,
	deleteProduct,
	getProductById,
} from '../models/modeloProductos.js'

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

routerProductos.get('/', async (req, res) => {
	const arrayProductos = await getProducts()
	res.json(arrayProductos)
})

routerProductos.get('/:id', async (req, res) => {
	const ident = req.params
	const response = await getProductById(ident)
	res.json(response)
})

routerProductos.post('/', async (req, res) => {
	const admin = userLevel()
	if (admin) {
		const product = req.body
		const response = await saveProduct(product)
		res.json(response)
	} else {
		const response = {
			error: '-1',
			descripcion: "ruta '/api/productos' método 'POST' no autorizada",
		}
		res.json(response)
	}
})

routerProductos.put('/:id', async (req, res) => {
	const admin = userLevel()
	if (admin) {
		const product = req.body
		const ident = req.params
		const response = await updateProduct(product, ident)
		res.json(response)
	} else {
		const response = {
			error: '-1',
			descripcion: "ruta '/api/productos' método 'PUT' no autorizada",
		}
		res.json(response)
	}
})

routerProductos.delete('/:id', async (req, res) => {
	const admin = userLevel()
	if (admin) {
		const ident = req.params
		const response = await deleteProduct(ident)
		res.json(response)
	} else {
		const response = {
			error: '-1',
			descripcion: "ruta '/api/productos' método 'DELETE' no autorizada",
		}
		res.json(response)
	}
})

export { routerProductos }
