const mongoose = require('mongoose')
const { mongodb } = require('../src/keys')

mongoose
	.connect(mongodb.URI, {
		useNewUrlParser: true,
	})
	.then((db) => console.log('conectado a mongodb - usuarios'))
	.catch((err) => console.log(err))

const Mensajes = require('../models/mensajesMongoDb')
const Productos = require('../models/productosMariaDB')
const { sqlite3, mysql, mongodatabase } = require('./options')

const mensajes = new Mensajes(
	process.env.MONGO_database,
	process.env.MONGO_collection
)

const productos = new Productos(mysql)
productos.crearTablaProductos().catch((err) => {
	console.log(err)
})
