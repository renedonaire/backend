const express = require('express')
const exphbs = require('express-handlebars')
const routerProductos = require('./router/routerProductos')
const { Server: HTTPServer } = require('http')
const { Server: SocketServer } = require('socket.io')
const { getProducts, saveProduct } = require('./models/productos')

const app = express()
const httpServer = new HTTPServer(app)
const io = new SocketServer(httpServer)

const path = require('path')
const route = path.join(__dirname, './storage/mensajes.txt')
const Mensajes = require('./models/mensajes')

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
io.on('connection', async (socket) => {
	console.log('Nuevo cliente conectado')

	const messages = await mensajes.getMessages()
	socket.emit('messages', messages)

	const products = getProducts()
	socket.emit('products', products)

	socket.on('new-message', async (message) => {
		await mensajes.saveMessage(message)
		const allMessages = await mensajes.getMessages()
		io.sockets.emit('messages', allMessages)
	})

	socket.on('new-product', (product) => {
		saveProduct(product)
		const allProducts = getProducts()
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
