const { Router } = require('express')
const router = Router()
const passport = require('passport')
const nodeProcess = require('node:process')
const os = require('os')
const { fork } = require('child_process')
const { loggerConsola, loggerWarning } = require('../logs/log4.js')

/* ------------------------------- Middlewares ------------------------------ */
const myLogger = (req, res, next) => {
	loggerWarning.warn('Recurso inexistente ', req.url)
	next()
}

/* ------------------------------- Inicializa ------------------------------- */
router.use(passport.initialize())
router.use(passport.session())
router.use(myLogger)

/* ----------------------------- Bases de Datos ----------------------------- */
const Productos = require('../models/productosMongoDb.js')
const productos = new Productos()

/* -------------------------------- Rutas API ------------------------------- */
router.get('/api/productos', async (req, res) => {
	loggerConsola.info('Ruta /api/productos, método GET')
	const arrayProductos = await productos.getProducts()
	res.status(200).send(arrayProductos)
})

router.get('/api/randoms', (req, res) => {
	loggerConsola.info('Ruta /api/randoms, método GET')
	const cant = parseInt(req.query.cant) || 100000000
	const computo = fork('src/api/randoms.js')
	computo.send(cant)
	computo.on('message', (result) => {
		res.render('../views/partials/randoms.hbs', {
			numeros: JSON.stringify(result),
		})
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

module.exports = router
