const router = require('express').Router()
const passport = require('passport')

const Mensajes = require('../models/mensajesMongoDb')
const Productos = require('../models/productosMariaDB')
const { sqlite3, mysql, mongodatabase } = require('../src/options')

const mensajes = new Mensajes(
	process.env.MONGO_database,
	process.env.MONGO_collection
)

const productos = new Productos(mysql)
productos.crearTablaProductos().catch((err) => {
	console.log(err)
})

router.get('/', isAuth, async (req, res) => {
	const arrayProductos = await productos.getProducts()
	res.render('../views/partials/list.hbs', {
		list: arrayProductos,
		nombre: req.session.nombre,
	})
})

router.get('/registro', (req, res, next) => {
	res.render('../views/partials/registro.hbs')
})

router.post(
	'/registro',
	passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/registro',
		failureFlash: true,
	})
)

router.get('/login', (req, res, next) => {
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

router.get('/logout', function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			return next(err)
		}
		res.redirect('/')
	})
})

function isAuth(req, res, next) {
	if (req.isAuthenticated()) {
		console.log('isAuth')
		return next()
	} else {
		console.log('isNotAuth')
		res.redirect('/login')
	}
}

module.exports = router
