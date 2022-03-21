const express = require('express')
const app = express()
const Api = require('./router/routerProductos')
const hbs = require('handlebars')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.json())

app.engine(
	'hbs',
	hbs({
		extname: 'hbs',
	})
)
app.set('view engine', 'hbs')

const rutas = new Api()
app
	.get('/api/productos', rutas.getAll)
	.get('/api/productos/:id', rutas.getById)
	.post('/api/productos', rutas.addNew)
	.put('/api/productos/:id', rutas.update)
	.delete('/api/productos/:id', rutas.delete)
	.use('*', rutas.error)

const PORT = 8080
const server = app.listen(PORT, () => {
	console.log(`Servidor escuchando el puerto ${server.address().port}`)
})

server.on('error', (error) => console.log(`Error en servidor ${error}`))
