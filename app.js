/* --------------------------------- Express -------------------------------- */
const express = require('express')
// const { Router } = require('express')
// const routerProductos = Router()
const cookieParser = require('cookie-parser')
const session = require('express-session')
const connectMongo = require('connect-mongo')

const MongoStore = connectMongo.create({
	mongoUrl:
		'mongodb+srv://renedonaire:YYY3fYzJ76EBkUp@cluster0.ux8ja.mongodb.net/coderhouse?retryWrites=true&w=majority',
	// mongoUrl: 'mongodb://localhost:27017/sesiones',
	ttl: 60,
})
console.log('conectado a mongodb - sesiones')

const app = express()
app
	.use(express.urlencoded({ extended: true }))
	.use(express.static('public'))
	.use(express.json())
// .use('/', routerProductos)

/* --------------------------------- Session -------------------------------- */
app.use(cookieParser())
app.use(
	session({
		store: MongoStore,
		secret: 'akjshsdj76%&ghfah',
		resave: false,
		saveUninitialized: false,
		// cookie: { maxAge: 60000 }, ahora la caducidad la maneja TTL
	})
)

/* --------------------------------- Sockets -------------------------------- */
const { Server: HTTPServer } = require('http')
const { Server: SocketServer } = require('socket.io')
const httpServer = new HTTPServer(app)
const io = new SocketServer(httpServer)

/* ------------------------ Clases en bases de datos ------------------------ */
const Mensajes = require('./models/mensajesMongoDb.js')
const Productos = require('./models/productosMariaDB.js')
const { sqlite3, mysql, mongodb } = require('./src/options.js')

const mensajes = new Mensajes(
	process.env.MONGO_database,
	process.env.MONGO_collection
)

const productos = new Productos(mysql)
productos.crearTablaProductos().catch((err) => {
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

app.get('/', async (req, res) => {
	if (req.session.nombre) {
		const arrayProductos = await productos.getProducts()
		res.render('../views/partials/list.hbs', {
			list: arrayProductos,
			nombre: req.session.nombre,
		})
	} else {
		res.redirect('/login')
	}
})

app.get('/login', (req, res) => {
	res.render('../views/partials/login.hbs')
})

app.post('/login', (req, res) => {
	const { nombre } = req.body
	req.session.nombre = nombre
	res.redirect('/')
})

app.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.log(err)
		} else {
			res.send('logout OK')
		}
	})
})

const { variosProductos } = require('./api/fakerApi.js')
app.get('/api/productos-test', async (req, res) => {
	const arrayProductos = await variosProductos(5)
	await res.render('../views/partials/listTest.hbs', { list: arrayProductos })
})

io.on('connection', async (socket) => {
	console.log('Nuevo cliente conectado')
	const messages = await mensajes.getMessages()
	socket.emit('messages', messages)
	const products = await productos.getProducts()
	socket.emit('products', products)

	socket
		.on('new-message', async (message) => {
			console.log('on new-message')
			await mensajes.saveMessage(message)
			console.log('mensaje guardado')
			const allMessages = await mensajes.getMessages()
			io.sockets.emit('messages', allMessages)
			console.log('mensajes emitidos')
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
