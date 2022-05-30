const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/user')

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
			console.log(user)
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
				console.log(newUser)
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
				console.log('No user found')
				return done(
					null,
					false,
					req.flash('signinMessage', 'No se encontró el usuario')
				)
			}
			if (!user.comparePassword(password)) {
				console.log('Wrong password')
				return done(
					null,
					false,
					req.flash('signinMessage', 'Password incorrecto')
				)
			}
			console.log('User found', user)
			return done(null, user)
		}
	)
)
