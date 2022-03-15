const express = require('express')
const app = express()
const Router = require('./router/routerProductos')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.json())

const rutas = new Router()
app
	.get('/api/productos', rutas.getAll)
	.get('/api/productos/:id', rutas.getById)
	.post('/api/productos', rutas.addNew)
	.put('/api/productos/:id', rutas.update)
	.delete('/api/productos/:id', rutas.delete)
	.use('*', rutas.error)

const PORT = 8080
const server = app.listen(PORT, () => {
	console.log(`Servidor escuchando el puerto ${server.address().port}`)
})

server.on('error', (error) => console.log(`Error en servidor ${error}`))
