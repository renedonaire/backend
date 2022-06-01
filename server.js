const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const exphbs = require('express-handlebars')
const { config } = require('dotenv')
config({ path: process.ENV })

// initializations
const app = express()
require('./src/database')
require('./passport/local-auth')

// settings
app.set('port', process.env.PORT || 8080)
app.engine(
	'hbs',
	exphbs.engine({
		extname: 'hbs',
	})
)
app
	.set('view engine', 'hbs')
	// app.use('/static', express.static(__dirname + '/public'))
	.use(express.urlencoded({ extended: true }))
	.use(express.static('public'))
	.use(express.json())

// middlewares
// app.use(express.urlencoded({ extended: false }))
app.use(
	session({
		secret: 'mysecretsession',
		resave: false,
		saveUninitialized: false,
	})
)
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
	app.locals.signinMessage = req.flash('signinMessage')
	app.locals.signupMessage = req.flash('signupMessage')
	app.locals.user = req.user
	next()
})

/* --------------------------------- Sockets -------------------------------- */
const { Server: HTTPServer } = require('http')
const { Server: SocketServer } = require('socket.io')
const httpServer = new HTTPServer(app)
const io = new SocketServer(httpServer)

/* ------------------------ Clases en bases de datos ------------------------ */
const Mensajes = require('./models/mensajesMongoDb.js')
const Productos = require('./models/productosMariaDB.js')
const { mysql } = require('./src/options.js')

// const mensajes = new Mensajes(
// 	process.env.MONGO_database,
// 	process.env.MONGO_mensajes
// )
const mensajes = new Mensajes()

const productos = new Productos(mysql)
productos.crearTablaProductos().catch((err) => {
	console.log(err)
})

// REQUERIDO para mensajes en sqlite3
// mensajes.crearTablaMensajes().catch((err) => {
// 	console.log(err)
// })

/* ---------------------------------- Rutas --------------------------------- */
app.get('/', isAuth, async (req, res) => {
	const arrayProductos = await productos.getProducts()
	res.render('../views/partials/list.hbs', {
		list: arrayProductos,
		emailUser: req.user.email,
	})
})

app.get('/registro', (req, res, next) => {
	res.render('../views/partials/registro.hbs')
})

app.post(
	'/registro',
	passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/registro',
		failureFlash: true,
	})
)

app.get('/login', (req, res, next) => {
	res.render('../views/partials/login.hbs')
})

app.post(
	'/login',
	passport.authenticate('local-signin', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true,
	})
)

app.get('/logout', (req, res, next) => {
	emailUser = req.user.email
	req.logout(function (err, emailUser) {
		if (err) {
			return next(err)
		} else {
			res.render('../views/partials/logout.hbs', {
				emailUser: this.emailUser,
			})
		}
	})
})

const { variosProductos } = require('./api/fakerApi.js')
app.get('/api/productos-test', async (req, res) => {
	const arrayProductos = await variosProductos(5)
	await res.render('../views/partials/listTest.hbs', { list: arrayProductos })
})

function isAuth(req, res, next) {
	if (req.isAuthenticated()) {
		console.log('isAuth')
		return next()
	} else {
		console.log('isNotAuth')
		res.redirect('/login')
	}
}

/* --------------------------------- emision -------------------------------- */
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
