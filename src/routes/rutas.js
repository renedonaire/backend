const { Router } = require('express')
const router = Router()
const passport = require('passport')
const { loggerWarning } = require('../logs/log4.js')

/* ------------------------------- Middlewares ------------------------------ */
const myLogger = (req, res, next) => {
	loggerWarning.warn('Recurso inexistente ', req.url)
	next()
}

router.use(passport.initialize())
router.use(passport.session())
router.use(myLogger)

/* ------------------------------- Inicializa ------------------------------- */
router.use(require('../routes/rutasRegistro.js'))
router.use(require('../routes/rutasMensajes.js'))
router.use(require('../routes/rutasProductos.js'))
router.use(require('../routes/rutasCarrito.js'))
router.use(require('../routes/rutasApi.js'))

module.exports = router
