const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const exphbs = require('express-handlebars')
const { config } = require('dotenv')
config({ path: process.ENV })

// initializations
const app = express()
require('./src/database')
require('./passport/local-auth')
require('./src/sockets')

// settings
app.set('port', process.env.PORT || 8080)
app.engine(
	'hbs',
	exphbs.engine({
		extname: 'hbs',
	})
)
app.set('view engine', 'hbs')

// middlewares
app.use(express.urlencoded({ extended: false }))
app.use(
	session({
		secret: 'mysecretsession',
		resave: false,
		saveUninitialized: false,
	})
)
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
	app.locals.signinMessage = req.flash('signinMessage')
	app.locals.signupMessage = req.flash('signupMessage')
	app.locals.user = req.user
	next()
})

// routes
app.use('/', require('./routes/index'))

// Starting the server
app.listen(app.get('port'), () => {
	console.log('server on port', app.get('port'))
})
