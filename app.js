/* --------------------------------- Express -------------------------------- */
const express = require('express')
const { Router } = require('express')
const routerProductos = Router()
const app = express()
app
	.use(express.urlencoded({ extended: true }))
	.use(express.static('public'))
	.use(express.json())
	.use('/', routerProductos)

/* --------------------------------- Sockets -------------------------------- */
const { Server: HTTPServer } = require('http')
const { Server: SocketServer } = require('socket.io')
const httpServer = new HTTPServer(app)
const io = new SocketServer(httpServer)

/* ---------------------------- Clases en memoria --------------------------- */
// const path = require('path')
// const route = path.join(__dirname, './ecommerce/mensajes.txt')
// const Mensajes = require('./models/mensajes')
// const Productos = require('./models/productos')
// const mensajes = new Mensajes(route)
// const productos = new Productos()

/* ------------------------ Clases en bases de datos ------------------------ */
const Mensajes = require('./models/mensajesSQL.js')
const Productos = require('./models/productosMariaDB.js')
const { sqlite3, mysql } = require('./src/options.js')
const {
	mensajesInicial,
	productosInicial,
} = require('./models/valoresIniciales.js')

const mensajes = new Mensajes(sqlite3)
mensajes.crearTablaMensajes().catch((err) => {
	console.log(err)
})

const productos = new Productos(mysql)
productos
	.crearTablaProductos()
	.then(() => {
		return productos.saveProduct(productosInicial)
	})
	.then(() => console.log('Tabla Productos creada'))
	.catch((err) => {
		console.log(err)
	})

/* ------------------------------- Handlebars ------------------------------- */
const exphbs = require('express-handlebars')
app.engine(
	'hbs',
	exphbs.engine({
		extname: 'hbs',
	})
)
routerProductos.get('/', async (req, res) => {
	const arrayProductos = await productos.getProducts()
	res.render('../views/layouts/main.hbs', { list: arrayProductos })
})

io.on('connection', async (socket) => {
	console.log('Nuevo cliente conectado')
	const messages = await mensajes.getMessages()
	socket.emit('messages', messages)
	const products = await productos.getProducts()
	socket.emit('products', products)

	socket
		.on('new-message', async (message) => {
			await mensajes.saveMessage(message)
			const allMessages = await mensajes.getMessages()
			io.sockets.emit('messages', allMessages)
		})
		.on('new-product', async (product) => {
			await productos.saveProduct(product)
			const allProducts = await productos.getProducts()
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
