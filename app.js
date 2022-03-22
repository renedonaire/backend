const express = require('express')
const app = express()
const Api = require('./router/routerProductos')
const exphbs = require('express-handlebars')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.engine(
	'hbs',
	exphbs.engine({
		extname: 'hbs',
	})
)
app.set('view engine', 'hbs')

const rutas = new Api()
app
	.get('/', rutas.home)
	.post('/productos', rutas.cargaProducto)
	.get('/productos', rutas.listaProductos)
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
