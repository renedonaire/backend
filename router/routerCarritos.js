import express from 'express'
import Router from 'express'
const routerCarritos = Router()
const app = express()
import {
	getCarts,
	createCart,
	deleteCart,
	getCartProductsById,
	addProductById,
	deleteProductById,
} from '../models/modeloCarritos.js'

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

routerCarritos.get('/', async (req, res) => {
	const arrayCarts = await getCarts()
	res.json(arrayCarts)
})

routerCarritos.get('/:id/productos', async (req, res) => {
	const ident = req.params
	const response = await getCartProductsById(ident)
	res.json(response)
})

routerCarritos.post('/', async (req, res) => {
	const response = await createCart()
	res.json(response)
})

routerCarritos.post('/:id/productos/:id_prod', async (req, res) => {
	const cart = req.params.id
	const prod = req.params.id_prod
	const response = await addProductById(cart, prod)
	res.json(response)
})

routerCarritos.delete('/:id', async (req, res) => {
	const ident = req.params
	const response = await deleteCart(ident)
	res.json(response)
})

routerCarritos.delete('/:id/productos/:id_prod', async (req, res) => {
	const cart = req.params.id
	const prod = req.params.id_prod
	const response = await deleteProductById(cart, prod)
	res.json(response)
})

export { routerCarritos }
