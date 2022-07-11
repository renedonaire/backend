const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const exphbs = require('express-handlebars')
const { config } = require('dotenv')
config({ path: process.ENV })
const { fork } = require('child_process')
const cluster = require('cluster')
const compression = require('compression')
const { loggerConsola, loggerWarning, loggerError } = require('./logs/log4.js')

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
	.use(express.static('uploads'))
	.use(express.json())
	.use(compression())

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

app.use((req, res, next) => {
	app.locals.signinMessage = req.flash('signinMessage')
	app.locals.signupMessage = req.flash('signupMessage')
	app.locals.user = req.user
	next()
})

const User = require('./models/userSchema')
const user = new User()

/* -------------------------- Sockets Configuración ------------------------- */
const { Server: HTTPServer } = require('http')
const { Server: SocketServer } = require('socket.io')
const httpServer = new HTTPServer(app)
const io = new SocketServer(httpServer)

/* ----------------------------- Bases de Datos ----------------------------- */
const Mensajes = require('./models/mensajesMongoDb.js')
const Productos = require('./models/productosMongoDb.js')
const passport = require('passport')
const mensajes = new Mensajes()
const productos = new Productos()

/* ------------------------------- Mensajería ------------------------------- */
const { enviarMail } = require('./mensajería/enviaEmail.js')

/* ---------------------------------- Rutas --------------------------------- */
app.use(require('./routes/rutas.js'))

/* ---------------------------- Sockets Listening --------------------------- */
io.on('connection', async (socket) => {
	loggerConsola.info('Nuevo cliente conectado')
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
		.on('new-cart', async (item) => {
			try {
				const newProducto = {
					code: item.code,
					title: item.title,
					price: item.price,
					qty: item.qty,
				}
				const actualizado = await User.findOneAndUpdate(
					{ name: item.username },
					{ $push: { carrito: newProducto } }
				)
				loggerConsola.info('Nuevo producto agregado al carrito')
			} catch (error) {
				loggerError.error(error)
			}
		})
		.on('new-buy', async (nombre) => {
			// Email y whatsapp al administrador
			console.log('Username: ', nombre)
			const user = await User.findOne({ nombre: nombre })
			console.log('User: ', user)
			const destinatario = process.env.ADMIN_EMAIL
			enviarMail(
				(to = `${destinatario}`),
				(subject = `Nuevo pedido de ${user.nombre} - ${user.email}`),
				(body = `<h3>Se ha registrado un nuevo pedido de ${user.nombre} - ${user.email}:</h3>
			<p>${user.carrito}</p>
			`)
			)

			// SMS al usuario
			//Agregar carrito a coleccion 'Pedidos'
			// Eliminar carrito de usuario
		})
})

/* --------------------------- Server con opciones -------------------------- */
function param(p) {
	const index = process.argv.indexOf(p)
	return index === -1 ? null : process.argv[index + 1]
}

const MODO = param('--modo') || 'FORK'

if (MODO == 'CLUSTER' && cluster.isMaster) {
	loggerConsola.info(`Modo: ${MODO}`)
	const numCPUs = os.cpus().length
	loggerConsola.info(`Número de procesadores: ${numCPUs}`)
	loggerConsola.info(`PID MASTER ${process.pid}`)
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork()
	}
	cluster.on('exit', (worker) => {
		loggerConsola.info(
			'Worker ',
			worker.process.pid,
			' died ',
			new Date().toLocaleString()
		)
		cluster.fork()
	})
} else {
	const PORT = param('--puerto') || process.env.PORT || 8080
	const server = httpServer.listen(PORT, () => {
		loggerConsola.info(
			`Servidor (sockets sobre http) escuchando el puerto ${PORT}`
		)
	})
	server.on('error', (error) => loggerError.error(`${error}`))
}
