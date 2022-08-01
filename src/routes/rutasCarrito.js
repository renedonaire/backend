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

/* ------------------------------ Rutas Carrito ----------------------------- */
router.get('/carrito', isAuth, async (req, res) => {
	loggerConsola.info('Ruta /carrito, método GET')
	res.render('../views/partials/carrito.hbs', {
		carrito: req.user.carrito,
		userName: req.user.nombre,
		userImage: req.user.avatar,
	})
})

module.exports = router
