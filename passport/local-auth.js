const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/userSchema')

passport.serializeUser((user, done) => {
	done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
	const user = await User.findById(id)
	done(null, user)
})

passport.use(
	'local-signup',
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			const user = await User.findOne({ email: email })
			if (user) {
				return done(
					null,
					false,
					req.flash('signupMessage', 'Ese email ya está registrado')
				)
			} else {
				const newUser = new User()
				newUser.email = email
				newUser.password = newUser.encryptPassword(password)
				newUser.nombre = req.body.nombre
				newUser.direccion = req.body.direccion
				newUser.edad = req.body.edad
				newUser.telefono = req.body.telefono
				newUser.avatar = req.body.avatar
				await newUser.save()
				done(null, newUser)
			}
		}
	)
)

passport.use(
	'local-signin',
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			const user = await User.findOne({ email: email })
			if (!user) {
				return done(
					null,
					false,
					req.flash('signinMessage', 'No se encontró el usuario')
				)
			}
			if (!user.comparePassword(password)) {
				return done(
					null,
					false,
					req.flash('signinMessage', 'Password incorrecto')
				)
			}
			return done(null, user)
		}
	)
)
