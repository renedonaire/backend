const { Router } = require('express')
const router = Router()
const multer = require('multer')
const path = require('path')
const passport = require('passport')
const { loggerConsola, loggerWarning, loggerError } = require('../logs/log4.js')
const nodeProcess = require('node:process')
const os = require('os')
const { fork } = require('child_process')

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
	destination: path.join(__dirname, '../uploads'),
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

router.get('/logout', (req, res, next) => {
	loggerConsola.info('Ruta /logout, método GET')
	userName = req.user.nombre
	req.logout(function (err, userName) {
		if (err) {
			return next(err)
		} else {
			res.render('../views/partials/logout.hbs', {
				userName: this.userName,
			})
		}
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

const { variosProductos } = require('../api/fakerApi.js')
router.get('/api/productos-test', async (req, res) => {
	loggerConsola.info('Ruta /api/productos/test, método GET')
	const arrayProductos = await variosProductos(5)
	await res.render('../views/partials/listTest.hbs', { list: arrayProductos })
})

module.exports = router
