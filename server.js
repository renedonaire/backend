const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const exphbs = require('express-handlebars')
const { config } = require('dotenv')
config({ path: process.ENV })
const parseArgs = require('minimist')
const nodeProcess = require('node:process')
const { getRandom } = require('./api/randoms')

/* ------------------------------- Inicializa ------------------------------- */
const app = express()
require('./src/database')
require('./passport/local-auth')

/* ----------------------- Argumento línea de comando ----------------------- */
function param(p) {
	const index = process.argv.indexOf(p)
	return process.argv[index + 1]
}

const puerto = parseInt(param('--puerto'))

/* --------------------------------- Ajustes -------------------------------- */
if (typeof puerto === 'number' && puerto > 0) {
	app.set('port', puerto)
} else {
	app.set('port', 8080)
}
app.engine(
	'hbs',
	exphbs.engine({
		extname: 'hbs',
	})
)
app
	.set('view engine', 'hbs')
	.use(express.urlencoded({ extended: true }))
	.use(express.static('public'))
	.use(express.json())

/* ------------------------------- Middlewares ------------------------------ */
app.use(
	session({
		secret: 'mysecretsession',
		resave: false,
		saveUninitialized: false,
		cookie: { _expires: process.env.tiempoTTL * 1000 }, // time im ms
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

const mensajes = new Mensajes()

const productos = new Productos(mysql)
productos.crearTablaProductos().catch((err) => {
	console.log(err)
})

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

app.get('/info', (req, res) => {
	const args = JSON.stringify(process.argv.slice(2))
	console.log('args: ', args)
	const pathEjecucion = process.argv[1]
	const processId = process.pid
	const folder = process.cwd()
	res.render('../views/partials/info.hbs', {
		args: args,
		plataforma: nodeProcess.platform,
		version: nodeProcess.version,
		memoria: (nodeProcess.memoryUsage.rss() / 1024 / 1024).toFixed(2),
		ruta: pathEjecucion,
		processId: processId,
		folder: folder,
	})
})

app.get('/api/randoms', async (req, res) => {
	const cant = parseInt(req.query.cant) || 100000000
	const numeros = await getRandom(cant)
	res.render('../views/partials/randoms.hbs', {
		numeros: JSON.stringify(numeros),
	})
})

const { variosProductos } = require('./api/fakerApi.js')
app.get('/api/productos-test', async (req, res) => {
	const arrayProductos = await variosProductos(5)
	await res.render('../views/partials/listTest.hbs', { list: arrayProductos })
})

function isAuth(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	} else {
		res.redirect('/login')
	}
}

/* --------------------------------- Listening -------------------------------- */
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

const server = httpServer.listen(app.get('port'), () => {
	console.log(
		`Servidor (sockets sobre http) escuchando el puerto ${
			server.address().port
		}`
	)
})
server.on('error', (error) => console.log(`${error}`))
