const { Router } = require('express')
const router = Router()
const path = require('path')
const multer = require('multer')
const passport = require('passport')
const { loggerConsola, loggerWarning } = require('../logs/log4.js')
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

/* ----------------------------- Rutas Registro y Login  ----------------------------- */
router.get('/', isAuth, async (req, res) => {
	loggerConsola.info('Ruta /, método GET')
	res.render('../views/partials/home.hbs', {
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

module.exports = router
