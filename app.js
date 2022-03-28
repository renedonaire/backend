const express = require('express')
const Api = require('./router/routerProductos')
const exphbs = require('express-handlebars')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('./public'))

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

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
	.post('/', rutas.cargaProducto)
	// .post('/productos', rutas.cargaProducto)
	// .get('/productos', rutas.listaProductos)
	// .get('/api/productos', rutas.getAll)
	// .get('/api/productos/:id', rutas.getById)
	// .post('/api/productos', rutas.addNew)
	// .put('/api/productos/:id', rutas.update)
	// .delete('/api/productos/:id', rutas.delete)
	.use('*', rutas.error)

const messages = [
	{ author: 'Juan', text: '¡Hola! ¿Que tal?' },
	{ author: 'Pedro', text: '¡Muy bien! ¿Y vos?' },
	{ author: 'Ana', text: '¡Genial!' },
]

const products = [
	{
		title: 'La Vuelta al Mundo en 80 días',
		price: 15900,
		thumbnail:
			'https://www.antartica.cl/media/catalog/product/9/7/9788417127916_1.png?quality=80&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700&format=jpeg',
		id: 1,
	},
	{
		title: 'Primera Persona Del Singular',
		price: 19900,
		thumbnail:
			'https://www.antartica.cl/media/catalog/product/9/7/9789569961212_1.png?quality=80&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700&format=jpeg',
		id: 2,
	},
	{
		title: 'Ajuste De Cuentas',
		price: 15000,
		thumbnail:
			'https://www.antartica.cl/media/catalog/product/9/7/9789569646867_1.png?quality=80&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700&format=jpeg',
		id: 3,
	},
]

io.on('connection', (socket) => {
	console.log('Un cliente se ha conectado')
	socket.emit('messages', messages)
	socket.emit('products', products)
	socket.on('new-message', (data) => {
		messages.push(data)
		io.sockets.emit('messages', messages)
	})
})

httpServer.listen(8080, function () {
	console.log('Servidor corriendo en http://localhost:8080')
})

httpServer.on('error', (error) => console.log(`Error en servidor ${error}`))
