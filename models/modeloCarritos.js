import fs from 'fs'
import { getProductById } from './modeloProductos.js'

const routeCarts = 'data/carritos.txt'

export const createCart = async () => {
	const stamp = new Date().toLocaleString('en-GB')
	const arrayCarts = await getCarts()
	let ident = 0
	let indexArray = []
	arrayCarts.forEach((element) => indexArray.push(element.id))
	if (indexArray.length > 0) {
		const arraySorted = indexArray.sort((a, b) => b - a)
		ident = arraySorted[0] + 1
	} else {
		ident = 1
	}
	const nuevo = { id: ident, timestamp: stamp, productos: [] }
	arrayCarts.unshift(nuevo)
	try {
		await fs.promises.writeFile(routeCarts, JSON.stringify(arrayCarts, null, 2))
		return { estado: 'carrito creado - ', ident }
	} catch (err) {
		console.log('Error al guardar: ', err)
	}
}

export const getCarts = async () => {
	try {
		const result = await fs.promises.readFile(routeCarts, 'utf-8')
		return JSON.parse(result)
	} catch (err) {
		await fs.promises.writeFile(routeCarts, JSON.stringify([], null, 2))
		const result = await fs.promises.readFile(routeCarts, 'utf-8')
		return JSON.parse(result)
	}
}

export const addProductById = async (cart, prod) => {
	const idProd = { id: prod }
	const product = await getProductById(idProd)
	const errorProd = JSON.stringify(product).search('error')
	if (errorProd != -1) {
		return { error: 'producto no existe' }
	}
	const idCart = { id: cart }
	const productosCarro = await getCartProductsById(idCart)
	const errorCarro = JSON.stringify(productosCarro).search('error')
	if (errorCarro != -1) {
		return { error: 'carrito no existe' }
	}
	let actualizado = []
	productosCarro.forEach((e) => actualizado.push(e))
	actualizado.push(product)
	const response = await updateCart(actualizado, cart)
	return response
}

export const updateCart = async (cart, ident) => {
	const arrayCarts = await getCarts()
	const id = parseInt(ident)
	const productos = cart
	const stamp = new Date().toLocaleString('en-GB')
	const updated = { id: id, timestamp: stamp, productos: productos }
	const actualizado = JSON.stringify(arrayCarts.find((e) => e.id === id))
	const index = arrayCarts.findIndex((e) => e.id === id)
	if (actualizado) {
		arrayCarts[index] = updated
		try {
			await fs.promises.writeFile(
				routeCarts,
				JSON.stringify(arrayCarts, null, 2)
			)
			return { estado: 'producto agregado' }
		} catch (err) {
			console.log('Error al guardar: ', err)
		}
	} else {
		return { error: 'no se halló carrito' }
	}
}

export const deleteProductById = async (cart, ident) => {
	const arrayCarts = await getCarts()
	const stamp = new Date().toLocaleString('en-GB')
	const id = parseInt(ident)
	const index = arrayCarts.findIndex((e) => e.id == cart)
	if (index === -1) {
		return { error: 'carrito no existe' }
	}
	const indice = arrayCarts[index].productos.findIndex((e) => e.id == id)
	if (indice === -1) {
		return { error: 'producto no existe en el carrito' }
	}
	try {
		const newProduct = arrayCarts[index].productos.filter((e) => e.id != id)
		arrayCarts[index].productos = newProduct
		arrayCarts[index].timestamp = stamp
		await fs.promises.writeFile(routeCarts, JSON.stringify(arrayCarts, null, 2))
		return { estado: 'producto eliminado' }
	} catch (err) {
		console.log('Error al guardar: ', err)
	}
}

export const deleteCart = async (ident) => {
	const arrayCarts = await getCarts()
	const id = parseInt(ident.id)
	const index = arrayCarts.findIndex((e) => e.id === id)
	if (index != -1) {
		try {
			const borrado = arrayCarts.filter((e) => e.id != id)
			await fs.promises.writeFile(routeCarts, JSON.stringify(borrado, null, 2))
			return { estado: 'carrito eliminado' }
		} catch (err) {
			console.log('Error al guardar: ', err)
		}
	} else {
		return { error: 'carrito no encontrado' }
	}
}

export const getCartProductsById = async (ident) => {
	const arrayCarts = await getCarts()
	const id = parseInt(ident.id)
	const hallado = arrayCarts.find((e) => e.id === id)
	if (hallado) {
		return hallado.productos
	} else {
		return { error: 'carrito no encontrado' }
	}
}

export const getCartById = async (ident) => {
	const arrayCarts = await getCarts()
	const id = parseInt(ident.id)
	const hallado = arrayCarts.find((e) => e.id === id)
	if (hallado) {
		return hallado
	} else {
		return { error: 'carrito no encontrado' }
	}
}
