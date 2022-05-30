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
app.set('view engine', 'hbs')
app.use('/static', express.static(__dirname + '/public'))

// middlewares
app.use(express.urlencoded({ extended: false }))
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

io.on('connection', async (socket) => {
	console.log('Nuevo cliente conectado a socket')
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

// routes
app.use('/', require('./routes/routes.js'))

//server
const server = httpServer.listen(app.get('port'), () => {
	console.log(
		`Servidor (sockets sobre http) escuchando el puerto ${
			server.address().port
		}`
	)
})
server.on('error', (error) => console.log(`Error en servidor: ${error}`))
