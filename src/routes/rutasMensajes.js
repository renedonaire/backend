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
const Mensajes = require('../models/mensajesMongoDb.js')
const mensajes = new Mensajes()

/* ----------------------------- Rutas Mensajes ----------------------------- */
router.get('/mensajes', isAuth, async (req, res) => {
	loggerConsola.info('Ruta /mensajes, método GET')
	res.render('../views/partials/mensajes.hbs', {
		userName: req.user.nombre,
		userImage: req.user.avatar,
		emailUser: req.user.email,
	})
})

module.exports = router
