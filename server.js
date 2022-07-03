const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const exphbs = require('express-handlebars')
const { config } = require('dotenv')
config({ path: process.ENV })
const nodeProcess = require('node:process')
const { fork } = require('child_process')
const cluster = require('cluster')
const os = require('os')
const compression = require('compression')
const { loggerConsola, loggerWarning, loggerError } = require('./logs/log4.js')
const multer = require('multer')
const path = require('path')

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
	.use(compression())

/* ------------------------------- Middlewares ------------------------------ */
/* Multer config */
const storage = multer.diskStorage({
	destination: path.join(__dirname, './uploads'),
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	},
})
const uploadImage = multer({
	storage,
	limits: { fileSize: 1000000 },
}).single('avatar')
/*-----*/

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

const myLogger = (req, res, next) => {
	loggerWarning.warn('Recurso inexistente ', req.url)
	next()
}

/* --------------------------------- Sockets -------------------------------- */
const { Server: HTTPServer } = require('http')
const { Server: SocketServer } = require('socket.io')
const httpServer = new HTTPServer(app)
const io = new SocketServer(httpServer)

/* ------------------------ Clases en bases de datos ------------------------ */
const Mensajes = require('./models/mensajesMongoDb.js')
const Productos = require('./models/productosMongoDb.js')
const mensajes = new Mensajes()
const productos = new Productos()

/* ---------------------------------- Rutas --------------------------------- */
app.get('/', isAuth, async (req, res) => {
	loggerConsola.info('Ruta /, método GET')
	const arrayProductos = await productos.getProducts()
	res.render('../views/partials/list.hbs', {
		list: arrayProductos,
		emailUser: req.user.email,
	})
})

app.get('/registro', (req, res) => {
	loggerConsola.info('Ruta /registro, método GET')
	res.render('../views/partials/registro.hbs')
})

app.post(
	'/registro',
	uploadImage,
	passport.authenticate('local-signup', {
		failureRedirect: '/registro',
		failureFlash: true,
	}),
	(req, res) => {
		res.redirect('/')
	}
)

app.get('/login', (req, res, next) => {
	loggerConsola.info('Ruta /login, método GET')
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
	loggerConsola.info('Ruta /logout, método GET')
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
	loggerConsola.info('Ruta /info, método GET')
	const args = JSON.stringify(process.argv.slice(2))
	const pathEjecucion = process.argv[1]
	const processId = process.pid
	const folder = process.cwd()
	const response = {
		args: args,
		plataforma: nodeProcess.platform,
		numCpus: os.cpus().length,
		version: nodeProcess.version,
		memoria: (nodeProcess.memoryUsage.rss() / 1024 / 1024).toFixed(2),
		ruta: pathEjecucion,
		processId: processId,
		folder: folder,
	}
	res.render('../views/partials/info.hbs', response)
})

app.get('/api/randoms', (req, res) => {
	loggerConsola.info('Ruta /api/randoms, método GET')
	const cant = parseInt(req.query.cant) || 100000000
	const computo = fork('./api/randoms.js')
	computo.send(cant)
	computo.on('message', (result) => {
		res.render('../views/partials/randoms.hbs', {
			numeros: JSON.stringify(result),
		})
	})
})

app.get('/datos', (req, res) => {
	loggerConsola.info('Ruta /datos, método GET')
	const PORT = param('--puerto') || 8080
	res.send(
		`Server en PORT(${PORT}) - PID(${
			process.pid
		}) - time: (${new Date().toLocaleString()})`
	)
})

const { variosProductos } = require('./api/fakerApi.js')
app.get('/api/productos-test', async (req, res) => {
	loggerConsola.info('Ruta /api/productos/test, método GET')
	const arrayProductos = await variosProductos(5)
	await res.render('../views/partials/listTest.hbs', { list: arrayProductos })
})

app.use(myLogger)

function isAuth(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	} else {
		res.redirect('/login')
	}
}

/* --------------------------------- Listening -------------------------------- */
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
})

/* --------------------------- SERVER CON CLUSTER --------------------------- */
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
