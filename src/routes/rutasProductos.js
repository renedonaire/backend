const { Router } = require('express')
const router = Router()
const passport = require('passport')
const { loggerConsola, loggerWarning } = require('../logs/log4.js')

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

/* ----------------------------- Bases de Datos ----------------------------- */
const Productos = require('../models/productosMongoDb.js')
const productos = new Productos()

/* ----------------------------- Rutas Productos ---------------------------- */
router.get('/productos', isAuth, async (req, res) => {
	loggerConsola.info('Ruta /productos, método GET')
	const arrayProductos = await productos.getProducts()
	res.render('../views/partials/productos.hbs', {
		list: arrayProductos,
		userName: req.user.nombre,
		userImage: req.user.avatar,
	})
})

router.post('/addProduct', isAuth, async (req, res) => {
	loggerConsola.info('Ruta /addProduct, método POST')
	const producto = {
		title: req.body.title,
		price: req.body.price,
		thumbnail: req.file.thumbnail,
		code: req.body.code,
	}
	await productos.saveProduct(producto)
	res.redirect('/productos')
})

const { variosProductos } = require('../api/fakerApi.js')
router.get('/api/productos-test', async (req, res) => {
	loggerConsola.info('Ruta /api/productos/test, método GET')
	const arrayProductos = await variosProductos(5)
	await res.render('../views/partials/listTest.hbs', { list: arrayProductos })
})

module.exports = router
