const router = require('express').Router()
const passport = require('passport')

router.get('/', isAuth, async (req, res) => {
	if (req.session.nombre) {
		const arrayProductos = await productos.getProducts()
		res.render('../views/partials/list.hbs', {
			list: arrayProductos,
			nombre: req.session.nombre,
		})
	} else {
		res.redirect('/login')
	}
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

router.get('/logout', (req, res, next) => {
	req.logout()
	res.redirect('/')
})

function isAuth(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	} else {
		res.redirect('/login')
	}
}

module.exports = router
