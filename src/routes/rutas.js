const { Router } = require('express')
const router = Router()
const multer = require('multer')
const path = require('path')
const passport = require('passport')
const { loggerConsola, loggerWarning, loggerError } = require('../logs/log4.js')
const nodeProcess = require('node:process')
const os = require('os')
const { fork } = require('child_process')
const { enviarMail } = require('../services/enviaEmail.js')

/* ------------------------------- Middlewares ------------------------------ */
const myLogger = (req, res, next) => {
	loggerWarning.warn('Recurso inexistente ', req.url)
	next()
}

function isAuth(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	} else {
		res.redirect('/login')
	}
}

/* ------------------------------- Inicializa ------------------------------- */
router.use(passport.initialize())
router.use(passport.session())
router.use(myLogger)

/* ------------------------------ Configuración ----------------------------- */
const storage = multer.diskStorage({
	destination: path.join(__dirname, '../public/uploads'),
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	},
})
const uploadImage = multer({
	storage,
	limits: { fileSize: 1000000 },
}).single('avatar')

/* ----------------------------- Bases de Datos ----------------------------- */
const Mensajes = require('../models/mensajesMongoDb.js')
const Productos = require('../models/productosMongoDb.js')
const mensajes = new Mensajes()
const productos = new Productos()

/* ---------------------------------- Rutas --------------------------------- */
router.get('/', isAuth, async (req, res) => {
	loggerConsola.info('Ruta /, método GET')
	res.render('../views/partials/home.hbs', {
		userName: req.user.nombre,
		userImage: req.user.avatar,
	})
})

router.get('/mensajes', isAuth, async (req, res) => {
	loggerConsola.info('Ruta /mensajes, método GET')
	res.render('../views/partials/mensajes.hbs', {
		userName: req.user.nombre,
		userImage: req.user.avatar,
		emailUser: req.user.email,
	})
})

router.get('/productos', isAuth, async (req, res) => {
	loggerConsola.info('Ruta /productos, método GET')
	const arrayProductos = await productos.getProducts()
	res.render('../views/partials/productos.hbs', {
		list: arrayProductos,
		userName: req.user.nombre,
		userImage: req.user.avatar,
	})
})

router.get('/carrito', isAuth, async (req, res) => {
	loggerConsola.info('Ruta /carrito, método GET')
	res.render('../views/partials/carrito.hbs', {
		carrito: req.user.carrito,
		userName: req.user.nombre,
		userImage: req.user.avatar,
	})
})

router.get('/registro', (req, res) => {
	loggerConsola.info('Ruta /registro, método GET')
	res.render('../views/partials/registro.hbs')
})

router.post(
	'/registro',
	uploadImage,
	passport.authenticate('local-signup', {
		failureRedirect: '/registro',
		failureFlash: true,
	}),
	(req, res) => {
		loggerConsola.info('Ruta /registro, método POST')
		const destinatario = process.env.ADMIN_EMAIL
		enviarMail(
			(to = `${destinatario}`),
			(subject = 'Nuevo usuario'),
			(body = `<h3>Se ha registrado un nuevo usuario:</h3>
			<p>Nombre: ${req.body.nombre}</p>
			<p>direccion: ${req.body.direccion}</p>
			<p>Edad: ${req.body.edad} </p>
			<p>Teléfono: ${req.body.telefono}</p>
			<p>Email: ${req.body.email}</p>
			`)
		)
		res.redirect('/')
	}
)

router.get('/login', (req, res, next) => {
	loggerConsola.info('Ruta /login, método GET')
	res.render('../views/partials/login.hbs')
})

router.post(
	'/login',
	passport.authenticate('local-signin', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true,
	})
)

router.get('/logout', isAuth, async (req, res) => {
	loggerConsola.info('Ruta /logout, método GET')
	res.render('../views/partials/logout.hbs', {
		userName: req.user.nombre,
	})
})

router.get('/info', (req, res) => {
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

router.get('/api/randoms', (req, res) => {
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

router.get('/datos', (req, res) => {
	loggerConsola.info('Ruta /datos, método GET')
	const PORT = param('--puerto') || 8080
	res.send(
		`Server en PORT(${PORT}) - PID(${
			process.pid
		}) - time: (${new Date().toLocaleString()})`
	)
})

// router.post('/add', isAuth, (req, res) => {
// 	console.log('REQ: ', req.body)
// 	loggerConsola.info('Ruta /add, método POST')
// 	const product = {
// 		code: req.code,
// 		title: req.title,
// 		price: req.price,
// 		qty: req.qty,
// 	}
// 	console.log('product: ', product)
// 	res.send(product)
// })

const { variosProductos } = require('../api/fakerApi.js')
router.get('/api/productos-test', async (req, res) => {
	loggerConsola.info('Ruta /api/productos/test, método GET')
	const arrayProductos = await variosProductos(5)
	await res.render('../views/partials/listTest.hbs', { list: arrayProductos })
})

module.exports = router
