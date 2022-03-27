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
	.post('/productos', rutas.cargaProducto)
	.get('/productos', rutas.listaProductos)
	.get('/api/productos', rutas.getAll)
	.get('/api/productos/:id', rutas.getById)
	.post('/api/productos', rutas.addNew)
	.put('/api/productos/:id', rutas.update)
	.delete('/api/productos/:id', rutas.delete)
	.use('*', rutas.error)

const messages = [
	{ author: 'Juan', text: '¡Hola! ¿Que tal?' },
	{ author: 'Pedro', text: '¡Muy bien! ¿Y vos?' },
	{ author: 'Ana', text: '¡Genial!' },
]

io.on('connection', (socket) => {
	console.log('Un cliente se ha conectado')
	socket.emit('messages', messages)
	socket.on('new-message', (data) => {
		messages.push(data)
		io.sockets.emit('messages', messages)
	})
})

httpServer.listen(8080, function () {
	console.log('Servidor corriendo en http://localhost:8080')
})

httpServer.on('error', (error) => console.log(`Error en servidor ${error}`))
