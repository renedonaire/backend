const express = require('express')
const exphbs = require('express-handlebars')
const { Server: HTTPServer } = require('http')
const { Server: SocketServer } = require('socket.io')
const { Router } = require('express')
const routerProductos = Router()

const app = express()
const httpServer = new HTTPServer(app)
const io = new SocketServer(httpServer)

const path = require('path')
const route = path.join(__dirname, './storage/mensajes.txt')
const Mensajes = require('./models/mensajes')
const Productos = require('./models/productos')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.json())

app.engine(
	'hbs',
	exphbs.engine({
		extname: 'hbs',
	})
)

app.use('/', routerProductos)

const mensajes = new Mensajes(route)
const productos = new Productos()
const arrayProductos = JSON.stringify(productos.getProducts())

routerProductos.get('/', (req, res) => {
	res.render('../views/layouts/main.hbs', { list: arrayProductos })
})

io.on('connection', async (socket) => {
	console.log('Nuevo cliente conectado')

	const messages = await mensajes.getMessages()
	socket.emit('messages', messages)

	const products = productos.getProducts()
	socket.emit('products', products)

	socket.on('new-message', async (message) => {
		await mensajes.saveMessage(message)
		const allMessages = await mensajes.getMessages()
		io.sockets.emit('messages', allMessages)
	})

	socket.on('new-product', (product) => {
		productos.saveProduct(product)
		const allProducts = productos.getProducts()
		io.sockets.emit('products', allProducts)
	})
})

const PORT = 8080
const server = httpServer.listen(PORT, () => {
	console.log(
		`Servidor (sockets sobre http) escuchando el puerto ${
			server.address().port
		}`
	)
})

server.on('error', (error) => console.log(`Error en servidor: ${error}`))
