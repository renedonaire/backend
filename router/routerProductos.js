import express from 'express'
import Router from 'express'
import { userLevel } from '../data/userLevel.js'
import {
	saveProduct,
	getProducts,
	updateProduct,
	deleteProduct,
	getProductById,
} from '../models/modeloProductos.js'

const routerProductos = Router()
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

routerProductos
	.get('/', async (req, res) => {
		const arrayProductos = await getProducts()
		res.json(arrayProductos)
	})
	.get('/:id', async (req, res) => {
		const ident = req.params
		const response = await getProductById(ident)
		res.json(response)
	})
	.post('/', async (req, res) => {
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
	.put('/:id', async (req, res) => {
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
	.delete('/:id', async (req, res) => {
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
