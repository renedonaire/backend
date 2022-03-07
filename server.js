const express = require('express')
const app = express()

const Contenedor = require('./js/operaciones')
const database = new Contenedor('.//data/productos.txt')

app.get('/productos', async (req, res) => {
	const response = await database.getAll()
	res.json({ response })
})

app.get('/productoRandom', async (req, res) => {
	const arrayProducts = await database.getAll()
	const min = 1
	const max = arrayProducts.length + 1
	const azar = Math.floor(Math.random() * (max - min)) + min
	const response = await database.getById(azar)
	res.json({ response })
})

const PORT = 8080
const server = app.listen(PORT, () => {
	console.log(`Servidor escuchando el puerto ${server.address().port}`)
})

server.on('error', (error) => console.log(`Error en servidor ${error}`))
